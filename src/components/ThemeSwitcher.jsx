import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, THEMES } from "../context/ThemeContext";
import { config } from "../config";
import { HiOutlineColorSwatch, HiX } from "react-icons/hi";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!config.showThemeSwitcher) return null;

  const enableTransition = () => {
    document.documentElement.classList.add("transitioning");
    setTimeout(() => document.documentElement.classList.remove("transitioning"), 500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-accent transition-colors"
        aria-label="Change color scheme"
      >
        {isOpen ? <HiX size={16} /> : <HiOutlineColorSwatch size={18} />}
      </motion.button>

      {/* Palette panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-14 left-0 glass rounded-2xl p-3 min-w-[180px]"
          >
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2.5 px-1">
              Color Scheme
            </p>
            <div className="flex flex-col gap-1">
              {THEMES.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      enableTransition();
                      setTheme(t.id);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-accent/10 text-text-primary"
                        : "text-text-secondary hover:bg-onyx hover:text-text-primary"
                    }`}
                  >
                    {/* Color swatch */}
                    <span
                      className="w-4 h-4 rounded-full shrink-0 ring-2 ring-offset-1 transition-all"
                      style={{
                        background: t.color,
                        ringColor: isActive ? t.color : "transparent",
                        ringOffsetColor: "var(--t-void)",
                        boxShadow: isActive ? `0 0 8px ${t.color}40` : "none",
                      }}
                    />
                    <span className="text-sm font-body">{t.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="theme-check"
                        className="ml-auto text-accent text-xs"
                      >
                        &#10003;
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
