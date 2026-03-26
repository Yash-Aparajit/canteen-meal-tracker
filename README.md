# 🏭 Canteen Breakfast Tracker

![Google Apps Script](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Factory Ready](https://img.shields.io/badge/Use%20Case-Industrial%20Deployment-blue)
![Barcode Scanner](https://img.shields.io/badge/Input-Barcode%20Scanner-orange)
![Concurrency Safe](https://img.shields.io/badge/Architecture-Concurrency%20Safe-brightgreen)
![Mobile Optimized](https://img.shields.io/badge/UI-Mobile%20Optimized-purple)
![License](https://img.shields.io/badge/License-Internal%20Use-lightgrey)

An industrial-grade breakfast tracking web application designed for factory canteen operations.  
Built using **Google Apps Script + Spreadsheet backend**, optimized for **handheld barcode scanners (e.g. CipherLab RK25)** and multi-device concurrent usage.

---

## 🚀 Key Features

- ⚡ Instant employee lookup via barcode scan
- 🏭 Designed for real factory deployment environments
- 📱 Mobile + handheld scanner optimized UI
- 🔒 Concurrency-safe logging using LockService
- ⏱ Shift time window enforcement
- 🌙 Night shift unrestricted entry logic
- 🧠 Intelligent frontend async handling
- 🔁 Long-session kiosk stability watchdog
- 🚫 Duplicate prevention per shift per day
- 🔔 Audio + vibration feedback on success/failure
- 📊 Simple Google Sheet backend logging
- 🧾 Minimal training required for operators

---

## 🏗 Architecture Overview
Handheld Scanner → Web App UI → Apps Script Backend → Google Sheet Log


### Backend
- Google Apps Script Web App
- In-memory employee cache with TTL
- LockService for concurrency protection
- Time-window validation logic
- Duplicate detection logic

### Frontend
- Vanilla HTML + CSS + JS
- Reactive employee lookup
- Debounced async fetch
- Save action lock protection
- Industrial UX patterns

---

## 📋 Data Structure

### Employee Master Sheet

| EMP_CODE | EMP_NAME |
|---------|----------|

### Breakfast Log Sheet

| TIMESTAMP | EMP_CODE | EMP_NAME | SHIFT | DATE_KEY |
|----------|-----------|-----------|-------|----------|

---

## ⏰ Shift Logic

| Shift | Allowed Time Window |


System automatically suggests shift but allows manual override.

---

## 🧠 Industrial Design Considerations

This system is intentionally designed for:

- High throughput scanning environments
- Multi-device concurrent logging
- Minimal operator cognitive load
- Network latency tolerance
- Long-running kiosk sessions
- Background tab lifecycle resilience
- Scanner wedge input behaviour

---

## 🔒 Concurrency Strategy

- ScriptLock ensures atomic log writes
- Frontend save lock prevents double submit
- Backend duplicate check prevents logical race
- Async fetch guard prevents stale UI state

---

## 📱 Device Compatibility

Tested & optimized for:

- CipherLab RK25
- Zebra industrial scanners
- Android Chrome kiosk mode
- Tablet-mounted canteen terminals

---

## ⚠️ Operational Notes

- Recommended monthly log archival for performance
- Ensure stable WiFi in canteen area
- Scanner must be configured in keyboard wedge mode
- Avoid browser auto-sleep policies

---

## 🛠 Future Enhancements

Planned evolution areas:

- Auto-submit scan mode
- Multi-plant tracking
- Supervisor override workflow
- Analytics dashboard
- Offline sync buffer
- Partitioned log architecture
- Firebase migration option

---

## 📄 License

Internal enterprise use.  
Not intended as public SaaS product.

---

## 👨‍💻 Author

By Yash Aparajit
---

## ⭐ Real-World Status

This system has been engineered with **actual factory constraints in mind**, not as a demo or prototype.

Designed for reliability, simplicity, and operator trust.
