/**
 * Main application for Restriction Tracker
 * Initializes and coordinates all modules
 */
const App = {
  // Current state
  currentView: 'roster',
  currentRestrictee: null,
  currentMusterTime: null,
  editingId: null,
  customMusterTimes: [],

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    ThemeManager.init();

    // Set up event listeners
    this.bindEvents();

    // Load initial view
    this.renderRoster();

    // Set default date for report
    document.getElementById('report-date').value = DateUtils.today();

    // Load settings
    this.loadSettings();

    // Update roster periodically for muster status
    setInterval(() => this.updateRosterStatus(), 60000);
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Header buttons
    document.getElementById('settings-btn').addEventListener('click', () => this.showSettingsModal());
    document.getElementById('theme-btn').addEventListener('click', () => ThemeManager.toggle());

    // Add person buttons
    document.getElementById('add-person-btn').addEventListener('click', () => this.showFormView());
    document.getElementById('add-first-btn').addEventListener('click', () => this.showFormView());

    // Completed section toggle
    document.getElementById('completed-toggle').addEventListener('click', () => this.toggleCompletedSection());

    // Form view
    document.getElementById('form-cancel-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('form-save-btn').addEventListener('click', () => this.savePerson());
    document.getElementById('person-startdate').addEventListener('change', () => this.updateEndDate());
    document.getElementById('person-days').addEventListener('change', () => this.updateEndDate());
    document.getElementById('add-custom-time-btn').addEventListener('click', () => this.addCustomMusterTime());

    // Sign-in view
    document.getElementById('signin-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('signin-present').addEventListener('click', () => this.recordMuster('present'));
    document.getElementById('signin-late').addEventListener('click', () => this.recordMuster('late'));
    document.getElementById('signin-missed').addEventListener('click', () => this.recordMuster('missed'));
    document.getElementById('signin-excused').addEventListener('click', () => this.recordMuster('excused'));

    // Detail view
    document.getElementById('detail-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('detail-export-btn').addEventListener('click', () => this.exportIndividualReport());
    document.getElementById('detail-edit-btn').addEventListener('click', () => this.editCurrentRestrictee());
    document.getElementById('detail-end-btn').addEventListener('click', () => this.endRestriction());

    // Report view
    document.getElementById('report-back-btn').addEventListener('click', () => this.showRosterView());
    document.getElementById('report-export-btn').addEventListener('click', () => this.exportDailyReport());
    document.getElementById('report-date').addEventListener('change', () => this.renderReport());

    // Settings modal
    document.getElementById('settings-close-btn').addEventListener('click', () => this.hideSettingsModal());
    document.getElementById('settings-save-btn').addEventListener('click', () => this.saveSettings());
    document.getElementById('view-report-btn').addEventListener('click', () => {
      this.hideSettingsModal();
      this.showReportView();
    });
    document.getElementById('clear-data-btn').addEventListener('click', () => this.confirmClearData());

    // Theme radio buttons in settings
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        ThemeManager.setTheme(e.target.value);
      });
    });

    // Confirm modal
    document.getElementById('confirm-cancel-btn').addEventListener('click', () => this.hideConfirmModal());
    document.getElementById('confirm-ok-btn').addEventListener('click', () => this.handleConfirm());

    // Close modals on overlay click
    document.getElementById('settings-modal').addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal') this.hideSettingsModal();
    });
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
      if (e.target.id === 'confirm-modal') this.hideConfirmModal();
    });
  },

  /**
   * Show a specific view
   * @param {string} viewId - View element ID
   */
  showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
    document.getElementById(viewId).classList.add('view--active');
    this.currentView = viewId.replace('-view', '');
  },

  /**
   * Show roster view
   */
  showRosterView() {
    this.showView('roster-view');
    this.renderRoster();
  },

  /**
   * Show form view for adding/editing
   * @param {string} id - Optional restrictee ID for editing
   */
  showFormView(id = null) {
    this.editingId = id;
    this.customMusterTimes = [];

    if (id) {
      // Edit mode
      const restrictee = Roster.getById(id);
      if (!restrictee) return;

      document.getElementById('form-title').textContent = 'Edit Restrictee';
      this.populateForm(restrictee);
    } else {
      // Add mode
      document.getElementById('form-title').textContent = 'Add Restrictee';
      this.resetForm();
    }

    this.showView('form-view');
  },

  /**
   * Show sign-in view
   * @param {string} restricteeId - Restrictee ID
   * @param {string} musterTime - Muster time in HHMM format
   */
  showSignInView(restricteeId, musterTime) {
    const restrictee = Roster.getById(restricteeId);
    if (!restrictee) return;

    this.currentRestrictee = restrictee;
    this.currentMusterTime = musterTime;

    // Populate person info
    const personInfo = document.getElementById('signin-person-info');
    personInfo.innerHTML = `
      <h2 class="signin-person__name">${Roster.getDisplayName(restrictee)}</h2>
      <p class="signin-person__muster">${DateUtils.formatTimeDisplay(musterTime)} Muster</p>
    `;

    // Set default recorder from settings
    const settings = Storage.getAppData().settings;
    document.getElementById('signin-recorder').value = settings.defaultRecorder || '';

    // Hide notes by default
    document.getElementById('signin-notes-group').classList.add('hidden');
    document.getElementById('signin-notes').value = '';

    this.showView('signin-view');
  },

  /**
   * Show detail view for a restrictee
   * @param {string} restricteeId - Restrictee ID
   */
  showDetailView(restricteeId) {
    const restrictee = Roster.getById(restricteeId);
    if (!restrictee) return;

    this.currentRestrictee = restrictee;
    document.getElementById('detail-title').textContent = Roster.getDisplayName(restrictee);

    this.renderDetailContent(restrictee);
    this.showView('detail-view');
  },

  /**
   * Show report view
   */
  showReportView() {
    this.renderReport();
    this.showView('report-view');
  },

  /**
   * Render the roster list
   */
  renderRoster() {
    const restrictees = Roster.sortForDisplay(Roster.getAll());
    const active = restrictees.filter(r => r.active);
    const completed = restrictees.filter(r => !r.active);

    const rosterList = document.getElementById('roster-list');
    const emptyState = document.getElementById('empty-state');
    const completedSection = document.getElementById('completed-section');

    if (active.length === 0) {
      rosterList.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      rosterList.innerHTML = active.map(r => this.renderRosterCard(r)).join('');

      // Bind roster card events
      this.bindRosterCardEvents();
    }

    // Completed section
    if (completed.length > 0) {
      completedSection.classList.remove('hidden');
      document.getElementById('completed-toggle').querySelector('span').textContent =
        `Completed Restrictions (${completed.length})`;

      document.getElementById('completed-list').innerHTML =
        completed.map(r => this.renderRosterCard(r, true)).join('');
    } else {
      completedSection.classList.add('hidden');
    }
  },

  /**
   * Render a single roster card
   * @param {Object} restrictee - Restrictee object
   * @param {boolean} isCompleted - Whether this is a completed restriction
   * @returns {string} - HTML string
   */
  renderRosterCard(restrictee, isCompleted = false) {
    const status = Roster.getStatus(restrictee);
    const daysRemaining = status.daysRemaining;
    const daysText = daysRemaining > 0
      ? `${daysRemaining} of ${restrictee.daysAwarded} days remaining`
      : 'Restriction complete';

    let nextMusterText = '';
    if (!isCompleted && status.nextMuster) {
      const nm = status.nextMuster;
      const timeDisplay = DateUtils.formatTimeDisplay(nm.time);
      const untilText = DateUtils.formatMinutesUntil(nm.minutesUntil);

      let musterClass = 'roster-card__muster';
      if (nm.status === 'soon') musterClass += ' roster-card__muster--soon';
      if (nm.status === 'due' || nm.status === 'overdue') musterClass += ' roster-card__muster--overdue';

      nextMusterText = `<p class="${musterClass}">Next muster: ${timeDisplay} (${untilText})</p>`;
    } else if (!isCompleted && !status.nextMuster) {
      nextMusterText = '<p class="roster-card__muster">All musters complete for today</p>';
    }

    const typeLabel = restrictee.restrictionType !== 'restriction'
      ? `<span class="roster-card__type">${Roster.getTypeDisplayName(restrictee.restrictionType)}</span>`
      : '';

    const signInBtn = !isCompleted && status.nextMuster
      ? `<button class="btn btn--success btn--sm signin-btn-action" data-id="${restrictee.id}" data-time="${status.nextMuster.time}">Sign In</button>`
      : '';

    return `
      <div class="roster-card" data-id="${restrictee.id}">
        <div class="roster-card__header">
          <span class="roster-card__status ${status.statusClass}">${status.statusIcon}</span>
          <div class="roster-card__info">
            <h3 class="roster-card__name">${Roster.getDisplayName(restrictee)}${typeLabel}</h3>
            <p class="roster-card__meta">${daysText}</p>
            ${nextMusterText}
          </div>
        </div>
        <div class="roster-card__actions">
          ${signInBtn}
          <button class="btn btn--outline btn--sm view-log-btn" data-id="${restrictee.id}">View Log</button>
          <button class="btn btn--ghost btn--sm edit-btn" data-id="${restrictee.id}">Edit</button>
        </div>
      </div>
    `;
  },

  /**
   * Bind events to roster card buttons
   */
  bindRosterCardEvents() {
    document.querySelectorAll('.signin-btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const time = e.target.dataset.time;
        this.showSignInView(id, time);
      });
    });

    document.querySelectorAll('.view-log-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.showDetailView(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.showFormView(id);
      });
    });
  },

  /**
   * Update roster status (called periodically)
   */
  updateRosterStatus() {
    if (this.currentView === 'roster') {
      this.renderRoster();
    }
  },

  /**
   * Toggle completed section visibility
   */
  toggleCompletedSection() {
    const toggle = document.getElementById('completed-toggle');
    const list = document.getElementById('completed-list');
    toggle.classList.toggle('expanded');
    list.classList.toggle('hidden');
  },

  /**
   * Reset the person form
   */
  resetForm() {
    document.getElementById('person-form').reset();
    document.getElementById('person-startdate').value = DateUtils.today();
    document.getElementById('person-days').value = '30';
    this.updateEndDate();

    // Reset muster checkboxes
    document.querySelectorAll('.muster-time-cb').forEach(cb => cb.checked = true);

    // Clear custom times
    this.customMusterTimes = [];
    this.renderCustomMusterTimes();
  },

  /**
   * Populate form with restrictee data
   * @param {Object} restrictee - Restrictee object
   */
  populateForm(restrictee) {
    document.getElementById('person-rank').value = restrictee.rank;
    document.getElementById('person-lastname').value = restrictee.lastName;
    document.getElementById('person-firstname').value = restrictee.firstName;
    document.getElementById('person-mi').value = restrictee.mi || '';
    document.getElementById('person-edipi').value = restrictee.edipi || '';
    document.getElementById('person-unit').value = restrictee.unit || '';

    // Restriction type
    document.querySelector(`input[name="restriction-type"][value="${restrictee.restrictionType}"]`).checked = true;

    // Dates
    document.getElementById('person-startdate').value = restrictee.startDate;
    document.getElementById('person-days').value = restrictee.daysAwarded;
    document.getElementById('person-enddate').value = restrictee.endDate;

    document.getElementById('person-offense').value = restrictee.offense || '';
    document.getElementById('person-notes').value = restrictee.notes || '';

    // Muster times
    const standardTimes = ['0600', '1200', '1800', '2200'];
    document.querySelectorAll('.muster-time-cb').forEach(cb => {
      cb.checked = restrictee.musterTimes.includes(cb.value);
    });

    // Custom times
    this.customMusterTimes = restrictee.musterTimes.filter(t => !standardTimes.includes(t));
    this.renderCustomMusterTimes();
  },

  /**
   * Update end date based on start date and days
   */
  updateEndDate() {
    const startDate = document.getElementById('person-startdate').value;
    const days = parseInt(document.getElementById('person-days').value, 10);

    if (startDate && days > 0) {
      const endDate = DateUtils.calculateEndDate(startDate, days);
      document.getElementById('person-enddate').value = DateUtils.formatISO(endDate);
    }
  },

  /**
   * Add custom muster time
   */
  addCustomMusterTime() {
    const input = document.getElementById('custom-muster-time');
    const time = input.value;

    if (!time) return;

    // Convert HH:MM to HHMM
    const hhmm = time.replace(':', '');

    // Check if already exists
    const allTimes = this.getAllSelectedMusterTimes();
    if (allTimes.includes(hhmm)) {
      this.showToast('This time is already selected', 'warning');
      return;
    }

    this.customMusterTimes.push(hhmm);
    this.renderCustomMusterTimes();
    input.value = '';
  },

  /**
   * Remove custom muster time
   * @param {string} time - Time in HHMM format
   */
  removeCustomMusterTime(time) {
    this.customMusterTimes = this.customMusterTimes.filter(t => t !== time);
    this.renderCustomMusterTimes();
  },

  /**
   * Render custom muster times list
   */
  renderCustomMusterTimes() {
    const container = document.getElementById('custom-times-list');
    container.innerHTML = this.customMusterTimes.map(time => `
      <span class="custom-time-tag">
        ${DateUtils.formatTimeDisplay(time)}
        <button type="button" onclick="App.removeCustomMusterTime('${time}')" aria-label="Remove ${time}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');
  },

  /**
   * Get all selected muster times
   * @returns {string[]} - Array of times in HHMM format
   */
  getAllSelectedMusterTimes() {
    const standard = [];
    document.querySelectorAll('.muster-time-cb:checked').forEach(cb => {
      standard.push(cb.value);
    });
    return [...standard, ...this.customMusterTimes].sort((a, b) =>
      DateUtils.parseTimeToMinutes(a) - DateUtils.parseTimeToMinutes(b)
    );
  },

  /**
   * Save person (add or update)
   */
  savePerson() {
    const formData = {
      rank: document.getElementById('person-rank').value,
      lastName: document.getElementById('person-lastname').value,
      firstName: document.getElementById('person-firstname').value,
      mi: document.getElementById('person-mi').value,
      edipi: document.getElementById('person-edipi').value,
      unit: document.getElementById('person-unit').value,
      restrictionType: document.querySelector('input[name="restriction-type"]:checked').value,
      startDate: document.getElementById('person-startdate').value,
      daysAwarded: document.getElementById('person-days').value,
      offense: document.getElementById('person-offense').value,
      notes: document.getElementById('person-notes').value,
      musterTimes: this.getAllSelectedMusterTimes()
    };

    const restrictee = Roster.fromFormData(formData);
    const validation = Roster.validate(restrictee);

    if (!validation.valid) {
      this.showToast(validation.errors[0], 'error');
      return;
    }

    if (this.editingId) {
      Roster.update(this.editingId, restrictee);
      this.showToast('Restrictee updated', 'success');
    } else {
      Roster.add(restrictee);
      this.showToast('Restrictee added', 'success');
    }

    this.showRosterView();
  },

  /**
   * Record muster sign-in
   * @param {string} status - Muster status
   */
  recordMuster(status) {
    const recorder = document.getElementById('signin-recorder').value.trim();
    const notes = document.getElementById('signin-notes').value.trim();

    if (!recorder) {
      this.showToast('Please enter who is recording this muster', 'warning');
      document.getElementById('signin-recorder').focus();
      return;
    }

    if ((status === 'late' || status === 'missed' || status === 'excused') && !notes) {
      // Show notes field and prompt
      document.getElementById('signin-notes-group').classList.remove('hidden');
      document.getElementById('signin-notes').focus();
      this.showToast('Please add a note for this status', 'warning');
      return;
    }

    Muster.recordSignIn({
      restricteeId: this.currentRestrictee.id,
      scheduledTime: this.currentMusterTime,
      status,
      recordedBy: recorder,
      notes
    });

    const statusDisplay = Muster.getStatusDisplay(status);
    this.showToast(`Muster recorded: ${statusDisplay.text}`, 'success');
    this.showRosterView();
  },

  /**
   * Render detail view content
   * @param {Object} restrictee - Restrictee object
   */
  renderDetailContent(restrictee) {
    const container = document.getElementById('detail-content');
    const daysRemaining = DateUtils.daysRemaining(restrictee.endDate);
    const stats = Muster.getStats(restrictee.id);

    let html = `
      <div class="detail-header">
        <h2 class="detail-header__name">${Roster.getDisplayName(restrictee)}</h2>
        <div class="detail-header__info">
          <div class="detail-header__item">
            <span class="detail-header__label">Type:</span>
            <span>${Roster.getTypeDisplayName(restrictee.restrictionType)}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Period:</span>
            <span>${DateUtils.formatMilitary(restrictee.startDate)} - ${DateUtils.formatMilitary(restrictee.endDate)}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Days Remaining:</span>
            <span>${daysRemaining > 0 ? daysRemaining : 'Complete'}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Muster Times:</span>
            <span>${restrictee.musterTimes.map(t => DateUtils.formatTimeDisplay(t)).join(', ')}</span>
          </div>
          <div class="detail-header__item">
            <span class="detail-header__label">Compliance:</span>
            <span>${stats.complianceRate}% (${stats.present + stats.late + stats.excused}/${stats.total})</span>
          </div>
        </div>
      </div>
    `;

    // Get grouped records
    const recordsByDate = Muster.getRecordsGroupedByDate(restrictee.id, 14);
    const today = DateUtils.today();

    // Always show today
    if (!recordsByDate[today]) {
      recordsByDate[today] = [];
    }

    const sortedDates = Object.keys(recordsByDate).sort().reverse();

    for (const date of sortedDates) {
      const dailyLog = Muster.buildDailyLog(restrictee, date);
      const isToday = date === today;

      html += `
        <div class="detail-day">
          <div class="detail-day__header">${isToday ? 'TODAY - ' : ''}${DateUtils.formatMilitary(date)}</div>
          <div class="detail-day__musters">
      `;

      for (const muster of dailyLog.musters) {
        let statusIcon, statusText;

        if (muster.status === 'pending') {
          statusIcon = Muster.getPendingIcon(muster.timeStatus);
          statusText = muster.timeStatus === 'overdue' ? 'OVERDUE' : 'Pending';
        } else if (muster.status === 'unrecorded') {
          statusIcon = '❓';
          statusText = 'No Record';
        } else {
          const display = Muster.getStatusDisplay(muster.status);
          statusIcon = display.icon;
          statusText = display.text;
        }

        html += `
          <div class="detail-muster">
            <span class="detail-muster__time">${DateUtils.formatTimeDisplay(muster.time)}</span>
            <span class="detail-muster__status">${statusIcon}</span>
            <span class="detail-muster__actual">${muster.actualTime ? DateUtils.formatTimeDisplay(muster.actualTime) : statusText}</span>
            <span class="detail-muster__recorder">${muster.recordedBy || ''}</span>
          </div>
        `;

        if (muster.notes) {
          html += `<div class="detail-muster__note">Note: ${muster.notes}</div>`;
        }
      }

      html += '</div></div>';
    }

    container.innerHTML = html;
  },

  /**
   * Edit current restrictee
   */
  editCurrentRestrictee() {
    if (this.currentRestrictee) {
      this.showFormView(this.currentRestrictee.id);
    }
  },

  /**
   * End restriction for current restrictee
   */
  endRestriction() {
    this.confirmAction(
      'End Restriction',
      `Are you sure you want to mark ${Roster.getDisplayName(this.currentRestrictee)}'s restriction as complete?`,
      () => {
        Roster.complete(this.currentRestrictee.id);
        this.showToast('Restriction marked as complete', 'success');
        this.showRosterView();
      }
    );
  },

  /**
   * Export individual report
   */
  exportIndividualReport() {
    if (this.currentRestrictee) {
      Reports.generateIndividualReport(this.currentRestrictee.id);
      this.showToast('Report downloaded', 'success');
    }
  },

  /**
   * Render report view
   */
  renderReport() {
    const date = document.getElementById('report-date').value;
    const settings = Storage.getAppData().settings;
    const html = Reports.buildDailyReportHTML(date, settings.unitName);
    document.getElementById('report-content').innerHTML = html;
  },

  /**
   * Export daily report
   */
  exportDailyReport() {
    const date = document.getElementById('report-date').value;
    const settings = Storage.getAppData().settings;
    Reports.generateDailyReport(date, settings.unitName);
    this.showToast('Report downloaded', 'success');
  },

  /**
   * Show settings modal
   */
  showSettingsModal() {
    const settings = Storage.getAppData().settings;
    document.getElementById('settings-unit').value = settings.unitName || '';
    document.getElementById('settings-recorder').value = settings.defaultRecorder || '';

    // Set theme radio
    const currentTheme = ThemeManager.getCurrent();
    document.querySelector(`input[name="theme"][value="${currentTheme}"]`).checked = true;

    document.getElementById('settings-modal').classList.add('modal-overlay--active');
  },

  /**
   * Hide settings modal
   */
  hideSettingsModal() {
    document.getElementById('settings-modal').classList.remove('modal-overlay--active');
  },

  /**
   * Load settings into form
   */
  loadSettings() {
    const settings = Storage.getAppData().settings;
    document.getElementById('settings-unit').value = settings.unitName || '';
    document.getElementById('settings-recorder').value = settings.defaultRecorder || '';
  },

  /**
   * Save settings
   */
  saveSettings() {
    const data = Storage.getAppData();
    data.settings.unitName = document.getElementById('settings-unit').value.trim();
    data.settings.defaultRecorder = document.getElementById('settings-recorder').value.trim();
    Storage.saveAppData(data);

    this.hideSettingsModal();
    this.showToast('Settings saved', 'success');
  },

  /**
   * Confirm clear data
   */
  confirmClearData() {
    this.confirmAction(
      'Clear All Data',
      'Are you sure you want to delete all data? This cannot be undone.',
      () => {
        Storage.remove(Storage.STORAGE_KEY);
        this.hideSettingsModal();
        this.showRosterView();
        this.showToast('All data cleared', 'success');
      }
    );
  },

  /**
   * Show confirm modal
   * @param {string} title - Modal title
   * @param {string} message - Confirmation message
   * @param {Function} onConfirm - Callback on confirm
   */
  confirmAction(title, message, onConfirm) {
    this.pendingConfirmAction = onConfirm;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').classList.add('modal-overlay--active');
  },

  /**
   * Hide confirm modal
   */
  hideConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('modal-overlay--active');
    this.pendingConfirmAction = null;
  },

  /**
   * Handle confirm button click
   */
  handleConfirm() {
    if (this.pendingConfirmAction) {
      this.pendingConfirmAction();
    }
    this.hideConfirmModal();
  },

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning)
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Make App available globally for inline handlers
window.App = App;
