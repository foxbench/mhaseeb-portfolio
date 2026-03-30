import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(e, href) {
    if (!isHome) {
      e.preventDefault();
      navigate("/" + href);
    }
  }

  function handleLogoClick(e) {
    if (!isHome) {
      e.preventDefault();
      navigate("/");
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-void/80 backdrop-blur-xl border-b border-slate-mid/30 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + Name */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-display font-bold text-accent text-sm group-hover:bg-accent/20 transition-colors">
            MH
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-bold text-text-primary text-sm tracking-tight">
              Muhammad Haseeb
            </span>
            <span className="font-mono text-[10px] text-text-muted tracking-wide">
              AI Integration Engineer
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={isHome ? item.href : "/" + item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-3 py-2 text-sm text-text-secondary hover:text-accent transition-colors font-body"
            >
              {item.label}
            </a>
          ))}

          {/* Dark mode toggle */}
          <div className="ml-2">
            <DarkModeToggle />
          </div>

          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={(e) => handleNavClick(e, "#contact")}
            className="ml-2 px-4 py-2 text-sm font-medium bg-accent/10 text-accent border border-accent/20 rounded-full hover:bg-accent/20 transition-colors"
          >
            Let's Talk
          </a>
        </div>

        {/* Mobile: dark mode + menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
          >
            {mobileOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian/95 backdrop-blur-xl border-b border-slate-mid/30 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={isHome ? item.href : "/" + item.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(e, item.href);
                  }}
                  className="px-3 py-2 text-text-secondary hover:text-accent transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
