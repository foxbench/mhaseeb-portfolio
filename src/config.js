/**
 * Portfolio configuration
 *
 * showThemeSwitcher: Show/hide the floating color scheme picker.
 *                    Set to false to lock the theme and hide the UI.
 * defaultTheme:      Initial color scheme if nothing saved in localStorage.
 *                    Options: 'emerald' | 'ocean' | 'ember' | 'violet'
 * defaultMode:       Initial light/dark mode.
 *                    Options: 'system' | 'dark' | 'light'
 */
export const config = {
  showThemeSwitcher: true,
  defaultTheme: "ocean",
  defaultMode: "dark",
  chatApiUrl:
    import.meta.env.VITE_CHAT_API_URL ||
    "http://localhost:8787/api/chat",
};
