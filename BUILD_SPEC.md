# SPEC: Restriction/EPD Sign-In Tracker

## Tool Overview

| Field | Value |
|-------|-------|
| **Repo Name** | `restriction-tracker` |
| **Full Title** | Restriction & Extra Duty Sign-In Log |
| **Description** | Digital muster log for personnel on restriction or EPD punishment. Replaces outdated Excel sheets with mobile-friendly sign-in tracking |
| **Complexity** | ⭐⭐⭐ (Medium) |
| **Estimated Build** | 4-5 days |
| **Priority** | 7 of 8 |

---

## Problem Statement

From Reddit user quickdraw_: *"Restriction sign-in paperwork - mentioned 2016 Excel still in use"*

Units managing personnel on restriction (Article 15 punishment) or Extra Punitive Duty (EPD) need to:
- Track muster times (typically 4-6x daily)
- Log sign-ins with timestamps
- Document missed musters
- Generate reports for legal/admin purposes
- Often using ancient Excel sheets that don't work well on phones

Current pain points:
- Excel sheets from 2016+ still in circulation
- Duty personnel have to manually log times
- No mobile-friendly option for OOD/SDNCO checking in restrictees
- Paper logs get lost or damaged
- Hard to generate compliance reports

---

## Core Features

### Must Have (MVP)
- [ ] Add personnel to restriction roster
- [ ] Configure muster times per person
- [ ] One-tap sign-in interface (big buttons, mobile-first)
- [ ] Automatic timestamp logging
- [ ] Missed muster highlighting/alerts
- [ ] Daily log view
- [ ] Export to PDF (daily/weekly report)
- [ ] LocalStorage persistence (single device)

### Should Have
- [ ] Restriction type (restriction, EPD, correctional custody)
- [ ] Start date / end date tracking
- [ ] Days remaining counter
- [ ] Reason/offense field (optional)
- [ ] Weekly summary view
- [ ] Print-friendly log format

### Nice to Have
- [ ] Multiple device sync (would require backend - Firebase?)
- [ ] Email daily log
- [ ] Barcode/QR scan for check-in
- [ ] Integration with unit roster import
- [ ] Historical archive

---

## Legal/Policy Background

### Article 15 Restriction Limits (10 USC 815)

| Grade | Max Restriction Days |
|-------|---------------------|
| E-1 to E-3 | 14 days (company grade CO) |
| E-1 to E-3 | 30 days (field grade+ CO) |
| E-4 to E-6 | 30 days (any CO) |
| E-7+ | 30 days (O-6+ or GCMCA) |
| Officers | 30 days (GCMCA only) |

### Typical Muster Requirements

Per BUPERSINST 1620.6 (Navy) and unit SOPs:
- Restrictees must muster at specified times
- Usually 4-6 times per day
- Common schedule: 0600, 1200, 1800, 2200 (or variations)
- Muster with OOD, SDNCO, or designated muster authority
- Missed muster = potential additional UCMJ violation

### Standard Restriction Limits

Personnel on restriction typically:
- Remain within specified limits (barracks, base, ship)
- Cannot possess civilian clothes, alcohol, etc.
- Perform full military duties
- May have liberty restricted to work/berthing/chow only

---

## Data Model

```javascript
// Personnel on restriction
const restrictee = {
  id: "uuid",
  edipi: "",           // Optional - for records
  rank: "PFC",
  lastName: "",
  firstName: "",
  mi: "",
  unit: "",            // Company/Platoon
  
  // Restriction details
  restrictionType: "restriction",  // restriction, epd, correctional_custody
  startDate: "2025-01-15",
  endDate: "2025-02-14",
  daysAwarded: 30,
  offense: "",         // Optional - reason for restriction
  
  // Muster schedule
  musterTimes: ["0600", "1200", "1800", "2200"],
  
  // Status
  active: true,
  notes: ""
};

// Individual muster record
const musterRecord = {
  id: "uuid",
  restricteeId: "uuid",
  date: "2025-01-20",
  scheduledTime: "0600",
  actualTime: "0558",       // Actual sign-in time
  status: "present",        // present, late, missed, excused
  recordedBy: "SSgt Smith", // Who logged the muster
  notes: "",                // Late reason, etc.
  timestamp: "2025-01-20T05:58:32Z"
};

// Daily log entry for reporting
const dailyLog = {
  date: "2025-01-20",
  restricteeId: "uuid",
  musters: [
    { time: "0600", status: "present", actualTime: "0558" },
    { time: "1200", status: "present", actualTime: "1202" },
    { time: "1800", status: "missed", actualTime: null },
    { time: "2200", status: "present", actualTime: "2155" }
  ],
  dutySupervisor: "GySgt Johnson",
  remarks: ""
};
```

---

## UI Layout

### View 1: Roster (Home Screen)
```
┌─────────────────────────────────────────────────────┐
│ RESTRICTION TRACKER                                  │
│ [Settings ⚙️]                     [+ Add Person]    │
├─────────────────────────────────────────────────────┤
│ Active Restrictees                                   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐│
│ │ 🔴 PFC SMITH, John A.                           ││
│ │    Days: 15 of 30 remaining                      ││
│ │    Next muster: 1200 (in 45 min)                ││
│ │    [Sign In]              [View Log] [Edit]     ││
│ └─────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────┐│
│ │ 🟡 LCpl JONES, Maria T.                         ││
│ │    Days: 3 of 14 remaining                       ││
│ │    Next muster: 1200 (in 45 min)                ││
│ │    [Sign In]              [View Log] [Edit]     ││
│ └─────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────┐│
│ │ ✅ Cpl DAVIS, Robert L.    (EPD)                ││
│ │    Days: 1 of 7 remaining                        ││
│ │    Next muster: 1800                             ││
│ │    [Sign In]              [View Log] [Edit]     ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ Completed (Archive)                                  │
│ └─ View 3 completed restrictions                   │
└─────────────────────────────────────────────────────┘
```

### View 2: Quick Sign-In (Mobile Optimized)
```
┌─────────────────────────────────────────────────────┐
│ ← Back                    MUSTER CHECK-IN           │
├─────────────────────────────────────────────────────┤
│                                                      │
│          PFC SMITH, John A.                         │
│          1200 Muster                                │
│                                                      │
│    ┌─────────────────────────────────────────┐     │
│    │                                         │     │
│    │            ✅ PRESENT                   │     │
│    │                                         │     │
│    │         (Tap to sign in)                │     │
│    │                                         │     │
│    └─────────────────────────────────────────┘     │
│                                                      │
│    ┌───────────────┐    ┌───────────────┐          │
│    │   ⏰ LATE     │    │   ❌ MISSED   │          │
│    └───────────────┘    └───────────────┘          │
│                                                      │
│    ┌───────────────────────────────────────┐       │
│    │   📝 EXCUSED (Add Note)               │       │
│    └───────────────────────────────────────┘       │
│                                                      │
│    Recorded by: [SSgt Garcia________▼]             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### View 3: Individual Log (Detail View)
```
┌─────────────────────────────────────────────────────┐
│ ← Roster              PFC SMITH, John A.            │
├─────────────────────────────────────────────────────┤
│ Restriction: 15 Jan - 14 Feb 2025 (30 days)        │
│ Days Remaining: 15                                  │
│ Type: Restriction                                   │
│ Muster Times: 0600, 1200, 1800, 2200               │
├─────────────────────────────────────────────────────┤
│ TODAY - 20 Jan 2025                                 │
│ ┌─────────────────────────────────────────────────┐│
│ │ 0600  ✅ 0558  SGT Martinez                     ││
│ │ 1200  ✅ 1202  SSgt Garcia                      ││
│ │ 1800  ⏳ Pending                                 ││
│ │ 2200  ⏳ Pending                                 ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ 19 Jan 2025                                         │
│ ┌─────────────────────────────────────────────────┐│
│ │ 0600  ✅ 0555  SGT Martinez                     ││
│ │ 1200  ✅ 1158  SSgt Garcia                      ││
│ │ 1800  ❌ MISSED                                  ││
│ │ 2200  ✅ 2145  GySgt Johnson                    ││
│ │       ⚠️ Note: Missed 1800 - at dental appt    ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ [Export PDF]    [Edit Details]    [End Restriction]│
└─────────────────────────────────────────────────────┘
```

### View 4: Add/Edit Restrictee
```
┌─────────────────────────────────────────────────────┐
│ ← Cancel               ADD RESTRICTEE        [Save]│
├─────────────────────────────────────────────────────┤
│ PERSONAL INFORMATION                                │
│ Rank:        [PFC_________▼]                       │
│ Last Name:   [___________________]                  │
│ First Name:  [___________________]                  │
│ MI:          [_]                                    │
│ EDIPI:       [__________] (optional)               │
│ Unit:        [___________________]                  │
├─────────────────────────────────────────────────────┤
│ RESTRICTION DETAILS                                 │
│ Type:        [Restriction____▼]                    │
│              ○ Restriction                          │
│              ○ Extra Punitive Duty (EPD)           │
│              ○ Correctional Custody                │
│                                                      │
│ Start Date:  [2025-01-15]                          │
│ Days Awarded: [30___]                               │
│ End Date:    2025-02-14 (calculated)               │
│                                                      │
│ Offense/Reason: (optional)                          │
│ [______________________________________]           │
│ [______________________________________]           │
├─────────────────────────────────────────────────────┤
│ MUSTER SCHEDULE                                     │
│ ☑️ 0600    ☑️ 1200    ☑️ 1800    ☑️ 2200          │
│                                                      │
│ Custom time: [____] [+ Add]                        │
├─────────────────────────────────────────────────────┤
│ Notes:                                              │
│ [______________________________________]           │
└─────────────────────────────────────────────────────┘
```

### View 5: Daily Report (Export View)
```
┌─────────────────────────────────────────────────────┐
│          RESTRICTION MUSTER LOG                      │
│          20 January 2025                            │
│          [Unit Name]                                │
├─────────────────────────────────────────────────────┤
│ PFC SMITH, John A.                                  │
│ Restriction: 15 Jan - 14 Feb 2025                  │
│ ─────────────────────────────────────────────────  │
│ TIME     STATUS    ACTUAL    RECORDED BY           │
│ 0600     PRESENT   0558      SGT Martinez          │
│ 1200     PRESENT   1202      SSgt Garcia           │
│ 1800     PRESENT   1755      GySgt Johnson         │
│ 2200     PRESENT   2148      SSgt Garcia           │
│                                                      │
├─────────────────────────────────────────────────────┤
│ LCpl JONES, Maria T.                                │
│ Restriction: 18 Jan - 01 Feb 2025                  │
│ ─────────────────────────────────────────────────  │
│ TIME     STATUS    ACTUAL    RECORDED BY           │
│ 0600     PRESENT   0602      SGT Martinez          │
│ 1200     LATE      1215      SSgt Garcia           │
│          Note: At medical appointment              │
│ 1800     PRESENT   1758      GySgt Johnson         │
│ 2200     PRESENT   2155      SSgt Garcia           │
│                                                      │
├─────────────────────────────────────────────────────┤
│ DUTY SUPERVISOR: GySgt Johnson                      │
│ SIGNATURE: ___________________________ DATE: _____ │
│                                                      │
│ REMARKS:                                            │
│ __________________________________________________ │
└─────────────────────────────────────────────────────┘
```

---

## Status Indicators

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Present | ✅ | Green | Signed in on time |
| Late | ⏰ | Yellow | Signed in after scheduled time |
| Missed | ❌ | Red | Did not sign in |
| Excused | 📝 | Blue | Missed with documented reason |
| Pending | ⏳ | Gray | Upcoming muster |

---

## Alert Logic

```javascript
// Determine if muster is upcoming/overdue
function getMusterStatus(scheduledTime, currentTime, records) {
  const scheduled = parseTime(scheduledTime);
  const now = currentTime;
  const record = records.find(r => r.scheduledTime === scheduledTime);
  
  if (record) {
    return record.status;  // Already recorded
  }
  
  const minutesDiff = (now - scheduled) / 60000;
  
  if (minutesDiff < -30) {
    return "upcoming";     // More than 30 min away
  } else if (minutesDiff < 0) {
    return "soon";         // Within 30 min
  } else if (minutesDiff < 15) {
    return "due";          // Grace period
  } else {
    return "overdue";      // Missed
  }
}
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| Rank | Required, valid rank |
| Last Name | Required |
| First Name | Required |
| Start Date | Required, valid date |
| Days Awarded | Required, 1-60 |
| Muster Times | At least 1 required |
| Recorded By | Required for sign-in |

---

## Data Persistence

### LocalStorage Structure
```javascript
// Main storage key
const STORAGE_KEY = 'restriction-tracker-data';

const appData = {
  restrictees: [...],
  musterRecords: [...],
  settings: {
    defaultMusterTimes: ["0600", "1200", "1800", "2200"],
    unitName: "",
    defaultRecorder: ""
  },
  lastUpdated: "2025-01-20T15:30:00Z"
};
```

### Export Format (PDF)
- Daily log with all restrictees
- Individual restriction history
- Weekly summary
- Print-ready format matching standard logs

---

## Multi-Device Sync (Future Enhancement)

If implementing backend sync:
- Firebase Realtime Database or Firestore
- User authentication (could use Google)
- Real-time updates when OOD signs someone in
- Conflict resolution for simultaneous updates

**Note for MVP:** Single device only. Data does not sync between phones. Export to PDF for official records.

---

## Tech Stack

```
- HTML5/CSS3/Vanilla JS
- Design System: /specs/DESIGN_SYSTEM.md
- PWA + Service Worker (offline critical for duty)
- LocalStorage / IndexedDB for persistence
- jsPDF for PDF export
- No backend for MVP
```

---

## File Structure

```
restriction-tracker/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── roster.js           # Roster management
│   ├── muster.js           # Sign-in logic
│   ├── reports.js          # PDF generation
│   └── lib/
│       ├── theme.js
│       ├── storage.js
│       └── date-utils.js
├── assets/
│   ├── icon-192.png
│   └── icon-512.png
├── README.md
├── LICENSE
└── CHANGELOG.md
```

---

## References

| Reference | Description |
|-----------|-------------|
| 10 USC 815 | Article 15, UCMJ - NJP Punishments |
| BUPERSINST 1620.6 | Navy Regional Restriction Barracks |
| MCM Part V | Rules for NJP |
| Unit SOPs | Local restriction muster requirements |

---

## Success Criteria

1. Add/edit restrictees with muster schedules
2. One-tap sign-in with timestamp
3. Visual status indicators (present/late/missed)
4. Days remaining counter
5. Export daily log to PDF
6. Works offline (PWA)
7. Mobile-first design (big touch targets)
8. Data persists in LocalStorage

---

## Notes for Claude Code

1. **Use the Design System** - Import all styles from `/specs/DESIGN_SYSTEM.md`
2. **Mobile-first** - Big buttons for sign-in, optimized for phone use in duty
3. **Offline critical** - OOD may not have internet, must work offline
4. **Time handling** - Store in 24hr, display flexible
5. **Date math** - Calculate end dates, days remaining accurately
6. **IndexedDB option** - If LocalStorage limits hit, use IndexedDB
7. **PDF format** - Match traditional paper log format for familiarity
8. **No PII transmission** - All data stays on device

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **quickdraw_** | r/USMC | Requested restriction sign-in paperwork generator - noted 2016 Excel sheets still in use |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Git Commit Guidelines

**IMPORTANT:** Do NOT include any Claude, Anthropic, or AI attribution in commit messages. Keep commits professional and human-authored in tone:

```
# GOOD commit messages:
git commit -m "Add muster sign-in with timestamp logging"
git commit -m "Implement days remaining calculation"
git commit -m "Add PDF export for daily muster log"

# BAD commit messages (do not use):
git commit -m "Generated by Claude..."
git commit -m "AI-assisted implementation of..."
```

---

*Spec created December 2025*
*Part of USMC Admin Tools Suite*
