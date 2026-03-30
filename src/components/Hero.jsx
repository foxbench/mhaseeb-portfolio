import { motion } from "framer-motion";
import { profile } from "../data/profile";
import { HiOutlineArrowDown, HiOutlineMail } from "react-icons/hi";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-onyx border border-slate-mid mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono text-text-secondary tracking-wide uppercase">
                {profile.availability}
              </span>
            </motion.div>

            {/* Name — the headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-3"
            >
              <span className="text-text-primary">Muhammad</span>
              <br />
              <span className="text-gradient">Haseeb</span>
            </motion.h1>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-accent/50" />
              <span className="font-display font-medium text-lg text-text-secondary">
                {profile.title} <span className="text-text-muted">&</span> {profile.subtitle}
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-base text-text-secondary leading-relaxed max-w-xl mb-8"
            >
              {profile.bio}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-void font-display font-bold rounded-full hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20 transition-all"
              >
                <HiOutlineMail className="text-lg" />
                Get In Touch
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-mid text-text-primary rounded-full hover:border-accent/40 hover:bg-accent/5 transition-all"
              >
                View Projects
                <HiOutlineArrowDown className="text-sm" />
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3"
            >
              {[
                { icon: FaLinkedinIn, href: profile.social.linkedin, label: "LinkedIn" },
                { icon: FaGithub, href: profile.social.github, label: "GitHub" },
                { icon: SiUpwork, href: profile.social.upwork, label: "Upwork" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-onyx border border-slate-mid flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — Stats bento grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {profile.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary font-body">
                  {stat.label}
                </div>
              </motion.div>
            ))}

            {/* Extra card — location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="col-span-2 glass rounded-2xl p-6 flex items-center justify-between"
            >
              <div>
                <div className="font-mono text-xs text-accent uppercase tracking-widest mb-1">Based in</div>
                <div className="font-display font-bold text-lg text-text-primary">{profile.location}</div>
                <div className="text-sm text-text-secondary">{profile.timezone} — Flexible for EU/US overlap</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-slate-mid flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-accent/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
