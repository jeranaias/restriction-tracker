# Restriction Tracker

Digital muster log for personnel on restriction or EPD punishment. A mobile-friendly sign-in tracking tool for USMC units.

## Features

- **Roster Management**: Add, edit, and track personnel on restriction, EPD, or correctional custody
- **One-Tap Sign-In**: Large, mobile-friendly buttons for quick muster check-ins
- **Automatic Timestamps**: Records exact sign-in times for all musters
- **Status Tracking**: Visual indicators for present, late, missed, and excused status
- **Days Remaining Counter**: Automatic calculation of restriction period progress
- **Muster Alerts**: Visual warnings for upcoming and overdue musters
- **PDF Export**: Generate daily logs and individual history reports
- **Offline Support**: Works without internet connection (PWA)
- **Dark/Night Mode**: Theme options including tactical red-on-black mode

## Quick Start

1. Open `index.html` in a modern web browser
2. Click "Add Person" to add a restrictee to the roster
3. Configure their muster schedule and restriction details
4. Use the "Sign In" button for each muster check-in
5. View logs and export reports as needed

## Usage

### Adding a Restrictee

1. Click "Add Person" on the main roster screen
2. Enter personal information (rank, name, unit)
3. Select restriction type (Restriction, EPD, or Correctional Custody)
4. Set start date and days awarded
5. Configure required muster times
6. Save the entry

### Recording Musters

1. Click "Sign In" on the restrictee's card
2. Select the appropriate status:
   - **Present**: On time
   - **Late**: Arrived after scheduled time (requires note)
   - **Missed**: Did not appear (requires note)
   - **Excused**: Absent with authorization (requires note)
3. Enter who recorded the muster
4. Submit

### Generating Reports

- **Daily Report**: Settings > View Daily Report > Export PDF
- **Individual History**: View Log > Export PDF

## Technical Details

- Pure HTML/CSS/JavaScript - no framework dependencies
- LocalStorage for data persistence
- Progressive Web App (PWA) with offline support
- Responsive design optimized for mobile devices
- Follows USMC Tools shared design system

## Data Storage

All data is stored locally in your browser's LocalStorage. Data does not sync between devices and is not transmitted over the internet.

To prevent data loss:
- Export reports regularly
- Consider backing up browser data

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome for Android)

## Legal References

| Reference | Description |
|-----------|-------------|
| 10 USC 815 | Article 15, UCMJ - NJP Punishments |
| BUPERSINST 1620.6 | Navy Regional Restriction Barracks |
| MCM Part V | Rules for NJP |

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **quickdraw_** | r/USMC | Requested restriction sign-in paperwork generator - noted 2016 Excel sheets still in use |

*This tool exists because Marines took the time to share their pain points. Thank you.*

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Links

- [USMC Tools Suite](https://jeranaias.github.io/usmc-tools/)
- [Report Issues](https://github.com/jeranaias/restriction-tracker/issues)

---

*Part of the USMC Admin Tools Suite*
