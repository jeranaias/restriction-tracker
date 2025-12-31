# Changelog

All notable changes to the Restriction Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-31

### Added
- Initial release of Restriction Tracker
- Roster management for personnel on restriction, EPD, or correctional custody
- Configurable muster times per person (standard + custom times)
- One-tap sign-in interface with large mobile-friendly buttons
- Status options: Present, Late, Missed, Excused
- Automatic timestamp logging for all musters
- Notes field for late/missed/excused entries
- Days remaining counter with automatic calculation
- Visual status indicators (icons and colors)
- Muster alert system showing upcoming and overdue musters
- Individual log view with history grouped by date
- Daily report view with all restrictees
- PDF export for daily logs
- PDF export for individual restriction history
- Settings panel for unit name and default recorder
- Theme support: Light, Dark, and Night (Tactical red-on-black)
- PWA with service worker for offline functionality
- LocalStorage persistence for all data
- Completed restrictions archive section
- Print-friendly report format
- Responsive design optimized for mobile devices
- Full accessibility support (keyboard navigation, ARIA labels)

### Technical
- Pure vanilla JavaScript implementation (no frameworks)
- Follows USMC Tools shared design system
- jsPDF integration for PDF generation
- UUID generation for unique record IDs
- Comprehensive date/time utility functions
- Modular code architecture

---

*Part of the USMC Admin Tools Suite*
