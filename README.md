# Restriction Tracker

Digital muster log for personnel on restriction or EPD punishment. A mobile-friendly sign-in tracking tool for USMC units.

**[Live Demo](https://jeranaias.github.io/restriction-tracker/)** | **[Report Issue](https://github.com/jeranaias/restriction-tracker/issues)**

---

## S1 Implementation Guide

This section explains how to deploy and use Restriction Tracker in your unit's administrative workflow.

### Who Should Use This Tool

- **S1 Admin Clerks** - Primary operators who maintain the roster and run reports
- **Duty NCOs/Officers** - Personnel conducting restriction musters
- **Legal/Adjutant** - Reviewing muster compliance for NJP documentation

### Recommended Setup

#### Option A: Shared Duty Phone/Tablet (Recommended)
1. Use a dedicated duty device (phone or tablet)
2. Install the app to the home screen for quick access
3. All duty personnel use the same device
4. Export data weekly as backup

#### Option B: Desktop Computer in S1
1. Open the app in Chrome/Edge on the S1 duty computer
2. Bookmark for quick access
3. All restriction musters recorded on this single machine
4. Export data at end of each week

#### Option C: Multiple Devices with Sync
1. Designate one device as the "master"
2. Other devices can be used during the day
3. At end of day, export from all devices
4. Import consolidated data to master device
5. More complex but allows distributed musters

### Initial Setup Steps

1. **Open the app** - Go to https://jeranaias.github.io/restriction-tracker/
2. **Install to device** - Add to home screen (mobile) or bookmark (desktop)
3. **Configure unit settings**:
   - Tap **Settings** in the bottom nav
   - Enter your unit name (e.g., "1st Bn, 5th Marines")
   - Set default recorder name (e.g., "Duty NCO")
4. **Add your restrictees**:
   - Tap **Roster** → **Add Person**
   - Enter their information from the Page 11/NJP paperwork
   - Set the correct muster times per their restriction order

### Daily Workflow

#### Morning (Before First Muster)

1. Open the app
2. Check the roster - cards show who needs to muster and when
3. Restrictees with upcoming musters show an alert badge

#### At Each Muster Time

1. Tap **Sign In** in the bottom nav (auto-selects next due muster)
   - Or tap **Sign In** on a specific person's card
2. When restrictee arrives:
   - Tap **PRESENT** (green) if on time
   - Tap **LATE** (yellow) if after scheduled time - add note
   - Tap **MISSED** (red) if no-show - add note
   - Tap **EXCUSED** if authorized absence - add note with authorization
3. Enter who recorded the muster (auto-fills from settings)
4. Muster is logged with timestamp

#### End of Day

1. Go to **Reports** in the bottom nav
2. Review the daily log for completeness
3. Tap **Export PDF** to generate a printable report
4. File the PDF with your restriction paperwork

### Navigation

The app has a **bottom navigation bar** with four sections:

| Tab | Purpose |
|-----|---------|
| **Roster** | View all restrictees, add new people, see muster status |
| **Sign In** | Quick sign-in for next due muster |
| **Reports** | Daily muster reports with PDF export |
| **Settings** | Unit configuration, data backup, theme |

### Weekly Duties

- **Export backup** - Settings → Export Data → Save the JSON file
- **Review missed musters** - Reports → check for patterns
- **Update roster** - Remove completed restrictions, add new ones

### Turnover Procedures

When rotating duty or transferring responsibility:

1. **Export all data**: Settings → Export Data
2. **Save the JSON file** to the unit shared drive
3. **Brief the relief** on current restrictees and any pending issues
4. **New person imports data**: Settings → Import Data (if using new device)

### Generating Reports for Legal/Adjutant

1. Go to **Reports** in bottom nav
2. Select the date you need
3. Tap **Export PDF**
4. This creates a log showing all musters for that day with timestamps
5. For individual history: Roster → tap person → **Export PDF**

---

## Features

### Core Functionality

- **Roster Management** - Add, edit, and track personnel on restriction, EPD, or correctional custody
- **One-Tap Sign-In** - Large, mobile-friendly buttons for quick muster check-ins
- **Automatic Timestamps** - Records exact sign-in times with timezone support
- **Status Tracking** - Visual indicators for present, late, missed, and excused status
- **Days Remaining Counter** - Automatic calculation of restriction period progress
- **Muster Alerts** - Visual warnings for upcoming and overdue musters
- **PDF Export** - Generate daily logs and individual history reports (works offline)

### Progressive Web App

- **Offline Support** - Full functionality without internet connection
- **Install to Home Screen** - Works like a native app on mobile devices
- **Automatic Updates** - Seamless background updates when online
- **Data Persistence** - All data stored locally in browser

### Accessibility & Themes

- **Light Mode** - Standard light theme for office use
- **Dark Mode** - Reduced eye strain for low-light environments
- **Night Mode** - Tactical red-on-black for light discipline scenarios
- **Keyboard Shortcuts** - Full keyboard navigation for power users
- **Mobile Optimized** - Touch-friendly interface for field use

### Data Management

- **Export/Import** - Backup and restore all data as JSON
- **Demo Mode** - Sample data for training and evaluation
- **Individual Reports** - Detailed muster history per restrictee
- **Daily Reports** - Complete unit muster log for each day

---

## Quick Start

1. Open the [Live Demo](https://jeranaias.github.io/restriction-tracker/) or `index.html` in a modern browser
2. Click "Add Person" to add a restrictee to the roster
3. Configure their muster schedule and restriction details
4. Use the "Sign In" button for each muster check-in
5. View logs and export reports as needed

### First-Time Setup

On first launch, you'll see a welcome screen with options to:
- **Start Fresh** - Begin with an empty roster
- **Load Demo Data** - Try the app with sample restrictees

---

## Usage Guide

### Adding a Restrictee

1. Go to **Roster** (bottom nav) and tap **Add Person**
2. Enter personal information:
   - Rank (select from dropdown)
   - Last Name, First Name, Middle Initial
   - Unit designation
3. Select restriction type:
   - **Restriction** - Standard restriction punishment
   - **EPD** - Extra Punitive Duty
   - **Correctional Custody** - Confinement to quarters
4. Set start date and total days awarded
5. Configure required muster times (standard: 0600, 1200, 1800, 2200)
6. Tap **Save**

### Recording Musters

1. Tap **Sign In** in bottom nav (goes to next due muster)
   - Or tap **Sign In** on a specific person's roster card
2. Select the appropriate status:

| Status | When to Use | Notes Required |
|--------|-------------|----------------|
| **Present** | On time at muster | No |
| **Late** | Arrived after scheduled time | Yes |
| **Missed** | Did not appear | Yes |
| **Excused** | Absent with authorization | Yes |

3. Enter recorder's name (who is recording the muster)
4. Add notes if required
5. Tap the status button to submit

### Viewing History

1. Tap on a restrictee's card to view their detail page
2. See all muster entries grouped by date
3. Use **Export PDF** to generate a printable report

### Generating Reports

| Report Type | How to Generate |
|-------------|-----------------|
| **Daily Report** | Reports (bottom nav) → Select date → Export PDF |
| **Individual History** | Roster → Tap person → Export PDF |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new person |
| `R` | Go to daily report |
| `S` | Open settings |
| `T` | Toggle theme (Light/Dark/Night) |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modal / Go back |

---

## Data Storage

All data is stored locally in your browser's LocalStorage. Data does **not** sync between devices and is **not** transmitted over the internet.

### Backup & Restore

1. **Export**: Settings → Export Data (downloads JSON file)
2. **Import**: Settings → Import Data (select JSON file)

**Important**: Export data regularly. Browser data can be lost by clearing history or device issues.

---

## Legal References

| Reference | Description |
|-----------|-------------|
| 10 USC 815 | Article 15, UCMJ - NJP Punishments |
| JAGINST 5800.7G | Manual of the Judge Advocate General |
| MCM Part V | Rules for Courts-Martial, Non-Judicial Punishment |
| MCO 5800.16 | Legal Support and Administration Manual |

---

## FAQ

### For S1 Shops

**Q: Can the S1 Chief and Admin Clerk both use this at the same time?**
A: If on different devices, each has separate data. Designate one device as the master for official records. You can export/import to merge data if needed.

**Q: What happens when a restrictee finishes their restriction?**
A: Tap their card → End Restriction. They move to the "Completed" section at the bottom of the roster and can be deleted when no longer needed.

**Q: How do I print a log for Legal?**
A: Reports → Select date → Export PDF. This creates a printable PDF with all muster entries and timestamps.

**Q: We have multiple duty sections running musters. How do we consolidate?**
A: Each section exports their data at end of duty. The primary S1 clerk imports all files to create a master record. Or use one shared device for all musters.

### General

**Q: Does my data sync between devices?**
A: No. All data is stored locally. Use Export/Import to transfer between devices.

**Q: Can I use this offline?**
A: Yes. After the first visit, works completely offline. Install to home screen for best experience.

**Q: Is my data secure?**
A: Data never leaves your device. No servers, no accounts, no transmission.

### Technical

**Q: Why isn't the app installing on my phone?**
A: Use the live demo link (HTTPS required). Look for "Add to Home Screen" in your browser menu.

**Q: My data disappeared. What happened?**
A: Browser data can be cleared by clearing history, private browsing, or storage pressure. Always export backups.

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **quickdraw_** | r/USMC | Requested restriction sign-in paperwork generator - noted 2016 Excel sheets still in use |

*This tool exists because Marines took the time to share their pain points.*

---

## Related Tools

- [Naval Letter Format](https://jeranaias.github.io/navalletterformat/) - Official correspondence generator
- [USMC Tools Suite](https://jeranaias.github.io/usmc-tools/) - Complete admin tools collection

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

*Part of the USMC Admin Tools Suite*
