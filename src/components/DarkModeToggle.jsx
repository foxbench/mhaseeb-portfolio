import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Sun icon
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Auto/system icon
function AutoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const MODE_META = {
  dark: { icon: MoonIcon, label: "Dark", next: "Switch to light mode" },
  light: { icon: SunIcon, label: "Light", next: "Switch to system mode" },
  system: { icon: AutoIcon, label: "Auto", next: "Switch to dark mode" },
};

export default function DarkModeToggle() {
  const { mode, cycleMode } = useTheme();
  const meta = MODE_META[mode];
  const Icon = meta.icon;

  const enableTransition = () => {
    document.documentElement.classList.add("transitioning");
    setTimeout(() => document.documentElement.classList.remove("transitioning"), 500);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        enableTransition();
        cycleMode();
      }}
      className="relative w-9 h-9 rounded-lg bg-onyx border border-slate-mid flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
      aria-label={meta.next}
      title={`${meta.label} mode — click to cycle`}
    >
      <motion.div
        key={mode}
        initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <Icon />
      </motion.div>

      {/* Mode indicator dot */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-void"
        style={{
          background:
            mode === "dark" ? "#8b5cf6" : mode === "light" ? "#fbbf24" : "#10b981",
        }}
      />
    </motion.button>
  );
}
