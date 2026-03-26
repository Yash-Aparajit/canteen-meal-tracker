const MASTER_SHEET = "EMP_MASTER";
const LOG_SHEET = "BREAKFAST_LOG";

function doGet(){
  return HtmlService.createHtmlOutputFromFile("index")
  .setTitle("Breakfast Tracker")
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function fetchEmployee(empCode){

  if(!empCode) return {status:false,msg:"Invalid Code"};

  const sheet = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const data = sheet.getRange(2,1,sheet.getLastRow(),2).getValues();

  const map = new Map(data.map(r => [String(r[0]), r[1]]));

  if(!map.has(String(empCode))){
    return {status:false,msg:"Employee Not Found"};
  }

  return {status:true,name:map.get(String(empCode))};
}


function logBreakfast(payload){

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try{

    if(!payload.empCode || !payload.empName || !payload.shift){
      return {status:false,msg:"Validation Failed"};
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(LOG_SHEET);

    const now = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

    sheet.appendRow([
      now,
      payload.empCode,
      payload.empName,
      payload.shift
    ]);

    return {status:true};

  }catch(err){
    return {status:false,msg:err.message};
  }
  finally{
    lock.releaseLock();
  }
}

