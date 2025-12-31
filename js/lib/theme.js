/**
 * Theme management for light/dark/night modes
 */
const ThemeManager = {
  STORAGE_KEY: 'usmc-tools-theme',
  THEMES: ['light', 'dark', 'night'],

  /**
   * Initialize theme from storage or system preference
   */
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.THEMES.includes(saved)) {
      this.setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  /**
   * Set the current theme
   * @param {string} theme - Theme name (light, dark, night)
   */
  setTheme(theme) {
    if (!this.THEMES.includes(theme)) {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Update theme-color meta tag
    const themeColor = theme === 'night' ? '#000000' : '#8B0000';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  },

  /**
   * Toggle to next theme in cycle
   */
  toggle() {
    const current = this.getCurrent();
    const currentIndex = this.THEMES.indexOf(current);
    const nextIndex = (currentIndex + 1) % this.THEMES.length;
    this.setTheme(this.THEMES[nextIndex]);
  },

  /**
   * Get current theme
   * @returns {string} - Current theme name
   */
  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  /**
   * Get theme display name
   * @param {string} theme - Theme identifier
   * @returns {string} - Display name
   */
  getDisplayName(theme) {
    const names = {
      light: 'Light',
      dark: 'Dark',
      night: 'Night (Tactical)'
    };
    return names[theme] || 'Light';
  }
};

// Make available globally
window.ThemeManager = ThemeManager;
