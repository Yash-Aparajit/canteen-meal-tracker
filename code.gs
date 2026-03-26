const MASTER_SHEET = "EMP_MASTER";
const LOG_SHEET = "BREAKFAST_LOG";

let EMP_CACHE = null;

function doGet(){
  return HtmlService.createHtmlOutputFromFile("index")
  .setTitle("Breakfast System")
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* ========= MASTER CACHE ========= */

function loadEmpCache(){
  if(EMP_CACHE !== null) return;

  const sh = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const data = sh.getRange(2,1,sh.getLastRow()-1,2).getValues();

  EMP_CACHE = new Map();
  data.forEach(r => {
    EMP_CACHE.set(String(r[0]).trim(), r[1]);
  });
}

function fetchEmployee(empCode){

  if(!empCode) return {status:false,msg:"Invalid Code"};

  loadEmpCache();

  if(!EMP_CACHE.has(String(empCode))){
    return {status:false,msg:"Employee Not Found"};
  }

  return {
    status:true,
    name: EMP_CACHE.get(String(empCode))
  };
}


/* ========= TIME WINDOW ========= */

function getShiftWindow(){

  const now = new Date();
  const minutes = now.getHours()*60 + now.getMinutes();

  const FIRST_START = 6*60;
  const FIRST_END = 6*60 + 45;

  const GENERAL_START = 9*60;
  const GENERAL_END = 9*60 + 45;

  const SECOND_START = 15*60;
  const SECOND_END = 15*60 + 45;

  if(minutes >= FIRST_START && minutes <= FIRST_END){
    return "1st Shift";
  }

  if(minutes >= GENERAL_START && minutes <= GENERAL_END){
    return "General Shift";
  }

  if(minutes >= SECOND_START && minutes <= SECOND_END){
    return "2nd Shift";
  }

  return null; // night or invalid
}


/* ========= MAIN SAVE ========= */

function logBreakfast(payload){

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try{

    if(!payload.empCode || !payload.empName || !payload.shift){
      return {status:false,msg:"Validation Failed"};
    }

    const autoShift = getShiftWindow();

    if(payload.shift !== "Night Shift"){
      if(!autoShift){
        return {status:false,msg:"Not eligible at this time"};
      }
      if(autoShift !== payload.shift){
        return {status:false,msg:"Not eligible at this time"};
      }
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(LOG_SHEET);

    const now = new Date();

    const dateKey = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "yyyyMMdd"
    );

    const lastRow = sheet.getLastRow();

    if(lastRow > 1){
      const data = sheet.getRange(2,2,lastRow-1,4).getValues();

      for(let i=0;i<data.length;i++){
        if(
          String(data[i][0]) === String(payload.empCode) &&
          String(data[i][2]) === String(payload.shift) &&
          String(data[i][3]) === String(dateKey)
        ){
          return {status:false,msg:"Already taken"};
        }
      }
    }

    const timestamp = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

    sheet.appendRow([
      timestamp,
      payload.empCode,
      payload.empName,
      payload.shift,
      dateKey
    ]);

    return {status:true};

  }catch(err){
    return {status:false,msg:err.message};
  }
  finally{
    lock.releaseLock();
  }
}

