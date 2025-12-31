# Restriction Tracker

Digital muster log for personnel on restriction or EPD punishment. A mobile-friendly sign-in tracking tool for USMC units.

**[Live Demo](https://jeranaias.github.io/restriction-tracker/)** | **[Report Issue](https://github.com/jeranaias/restriction-tracker/issues)**

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

1. Click **Add Person** on the main roster screen
2. Enter personal information:
   - Rank (select from dropdown)
   - Last Name, First Name, Middle Initial
   - Unit designation
3. Select restriction type:
   - **Restriction** - Standard restriction punishment
   - **EPD** - Extra Punitive Duty
   - **Correctional Custody** - Confinement to quarters
4. Set start date and total days awarded
5. Configure required muster times (0000-2359 format)
6. Click **Save**

### Recording Musters

1. Click **Sign In** on the restrictee's card
2. Select the appropriate status:
   | Status | When to Use |
   |--------|-------------|
   | **Present** | On time at muster |
   | **Late** | Arrived after scheduled time |
   | **Missed** | Did not appear |
   | **Excused** | Absent with authorization |
3. Enter recorder's name (who is recording the muster)
4. Add notes if required (mandatory for Late/Missed/Excused)
5. Click **Submit**

### Viewing History

1. Click on a restrictee's card to view their detail page
2. Click **View Log** to see complete muster history
3. Use **Export PDF** to generate a printable report

### Generating Reports

| Report Type | How to Generate |
|-------------|-----------------|
| **Daily Report** | Settings > View Daily Report > Export PDF |
| **Individual History** | Click restrictee > View Log > Export PDF |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new person |
| `R` | Go to roster view |
| `S` | Open settings |
| `T` | Toggle theme (Light/Dark/Night) |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modal / Go back |

---

## Technical Details

### Architecture

- **Pure JavaScript** - No framework dependencies
- **Modular Design** - Separate modules for roster, muster, reports, and utilities
- **LocalStorage** - All data persisted in browser storage
- **Service Worker** - Cache-first strategy for offline support
- **jsPDF** - Bundled locally for offline PDF generation

### File Structure

```
restriction-tracker/
├── index.html          # Main application
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline support
├── css/
│   └── styles.css      # USMC Design System
├── js/
│   ├── app.js          # Main controller
│   ├── roster.js       # Roster management
│   ├── muster.js       # Muster operations
│   ├── reports.js      # PDF generation
│   └── lib/
│       ├── storage.js  # LocalStorage wrapper
│       ├── date-utils.js # Date formatting
│       └── theme.js    # Theme management
├── lib/
│   └── jspdf.umd.min.js # PDF library
└── assets/
    ├── icon-192.svg    # App icons
    └── icon-512.svg
```

### Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome/Edge | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| iOS Safari | 13+ |
| Chrome Android | 80+ |

---

## Data Storage

All data is stored locally in your browser's LocalStorage. Data does **not** sync between devices and is **not** transmitted over the internet.

### Data Keys

| Key | Contents |
|-----|----------|
| `restrictees` | Roster of personnel |
| `musters` | All muster records |
| `theme` | Current theme preference |
| `restriction-tracker-welcomed` | First-run flag |

### Backup & Restore

1. **Export**: Settings > Export Data (downloads JSON file)
2. **Import**: Settings > Import Data (select JSON file)

**Recommendation**: Export data regularly to prevent loss from browser data clearing.

---

## Legal References

| Reference | Description |
|-----------|-------------|
| 10 USC 815 | Article 15, UCMJ - NJP Punishments |
| JAGINST 5800.7G | Manual of the Judge Advocate General |
| MCM Part V | Rules for Courts-Martial, Non-Judicial Punishment |
| MCO 5800.16 | Legal Support and Administration Manual |
| BUPERSINST 1620.6 | Navy Regional Restriction Barracks |

---

## FAQ

### General

**Q: Does my data sync between devices?**
A: No. All data is stored locally in your browser. Use Export/Import to transfer data between devices.

**Q: Can I use this offline?**
A: Yes. After the first visit, the app works completely offline. Install it to your home screen for the best experience.

**Q: Is my data secure?**
A: Data never leaves your device. There are no servers, no accounts, and no data transmission.

### Usage

**Q: What if someone signs in late?**
A: Select "Late" status when recording the muster. You'll be prompted to add a note explaining the reason.

**Q: Can I edit a muster record?**
A: Currently, muster records cannot be edited after submission to maintain log integrity. Add a new entry with notes if corrections are needed.

**Q: How do I remove someone who completed their restriction?**
A: Click on their card, scroll down, and click "Delete". This removes them and all their muster history.

### Technical

**Q: Why isn't the app installing on my phone?**
A: Make sure you're using HTTPS (the live demo link) and a supported browser. Look for "Add to Home Screen" in your browser menu.

**Q: My data disappeared. What happened?**
A: Browser data can be cleared by clearing browsing history, private browsing mode, or storage pressure. Always export backups regularly.

**Q: Can multiple people use this simultaneously?**
A: Each device has its own local data. For shared access, one device should be designated as the primary tracker, or use Export/Import to sync.

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **quickdraw_** | r/USMC | Requested restriction sign-in paperwork generator - noted 2016 Excel sheets still in use |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Related Tools

- [Naval Letter Format](https://jeranaias.github.io/navalletterformat/) - Official correspondence generator
- [USMC Tools Suite](https://jeranaias.github.io/usmc-tools/) - Complete admin tools collection

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

*Part of the USMC Admin Tools Suite*
