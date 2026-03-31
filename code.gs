/* ================= CONFIG ================= */

const MASTER_SHEET = "EMP_MASTER";
const LOG_SHEET = "BREAKFAST_LOG";

/* ================= MASTER CACHE ================= */

let EMP_CACHE = null;
let CACHE_TIME = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes


function loadEmpCache() {
  const now = Date.now();

  if (EMP_CACHE && (now - CACHE_TIME) < CACHE_TTL) {
    return;
  }

  const sh = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const lastRow = sh.getLastRow();

  if (lastRow < 2) {
    EMP_CACHE = new Map();
    return;
  }

  const data = sh.getRange(2, 1, lastRow - 1, 2).getValues();

  EMP_CACHE = new Map();

  data.forEach(row => {
    EMP_CACHE.set(String(row[0]).trim(), row[1]);
  });

  CACHE_TIME = now;
}


/* ================= FETCH EMPLOYEE ================= */

function fetchEmployee(empCode) {

  if (!empCode) {
    return { status: false, msg: "Invalid Code" };
  }

  loadEmpCache();

  if (!EMP_CACHE.has(String(empCode))) {
    return { status: false, msg: "Employee Not Found" };
  }

  return {
    status: true,
    name: EMP_CACHE.get(String(empCode))
  };
}


/* ================= TIME WINDOW ================= */

function getShiftWindow() {

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const FIRST_START = 6 * 60;
  const FIRST_END = 6 * 60 + 45;

  const GENERAL_START = 9 * 60;
  const GENERAL_END = 9 * 60 + 45;

  const SECOND_START = 15 * 60;
  const SECOND_END = 15 * 60 + 45;

  if (minutes >= FIRST_START && minutes <= FIRST_END) {
    return "1st Shift";
  }

  if (minutes >= GENERAL_START && minutes <= GENERAL_END) {
    return "General Shift";
  }

  if (minutes >= SECOND_START && minutes <= SECOND_END) {
    return "2nd Shift";
  }

  return null;
}


/* ================= SAVE BREAKFAST ================= */

function logBreakfast(payload) {

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {

    if (!payload.empCode || !payload.empName || !payload.shift) {
      return { status: false, msg: "Validation Failed" };
    }

    const autoShift = getShiftWindow();

    if (payload.shift !== "Night Shift") {
      if (!autoShift || autoShift !== payload.shift) {
        return { status: false, msg: "Not eligible at this time" };
      }
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(LOG_SHEET);
    const now = new Date();

    const dateKey = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "yyyyMMdd"
    );



    if (lastRow > 1) {

      const data = sheet.getRange(2, 2, lastRow - 1, 4).getValues();

      for (let i = 0; i < data.length; i++) {

        if (
          String(data[i][0]) === String(payload.empCode) &&
          String(data[i][2]) === String(payload.shift) &&
          String(data[i][3]) === String(dateKey)
        ) {
          return { status: false, msg: "Already taken" };
        }
      }
    }

    const timestamp = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

    const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy");
    const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm");

    sheet.appendRow([
      dateStr,
      timeStr,
      payload.empCode,
      payload.empName,
      payload.shift,
      dateKey
    ]);

    return { status: true };

  } catch (err) {

    return { status: false, msg: err.message };

  } finally {

    lock.releaseLock();
  }
}
