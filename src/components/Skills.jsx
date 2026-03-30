import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { useTheme } from "../context/ThemeContext";
import { skillCategories } from "../data/skills";
import SectionLabel from "./SectionLabel";
import { HiServer, HiDatabase, HiCode, HiLightningBolt, HiCloud, HiShoppingCart } from "react-icons/hi";

const ICONS = {
  server: HiServer,
  database: HiDatabase,
  layout: HiCode,
  brain: HiLightningBolt,
  cloud: HiCloud,
  shopping: HiShoppingCart,
};

// Category accent colors (fixed across themes — these are decorative per-category)
const CATEGORY_COLORS = {
  server: "#10b981",
  database: "#3b82f6",
  layout: "#eab308",
  brain: "#a855f7",
  cloud: "#f472b6",
  shopping: "#f97316",
};

function getTints(iconKey, isDark) {
  const c = CATEGORY_COLORS[iconKey] || CATEGORY_COLORS.server;
  const bgAlpha = isDark ? 0.08 : 0.05;
  const borderAlpha = isDark ? 0.18 : 0.14;
  const pillAlpha = isDark ? 0.12 : 0.08;
  const pillBorderAlpha = isDark ? 0.25 : 0.2;

  return {
    text: c,
    bg: `${c}${Math.round(bgAlpha * 255).toString(16).padStart(2, "0")}`,
    border: `${c}${Math.round(borderAlpha * 255).toString(16).padStart(2, "0")}`,
    pill: `${c}${Math.round(pillAlpha * 255).toString(16).padStart(2, "0")}`,
    pillBorder: `${c}${Math.round(pillBorderAlpha * 255).toString(16).padStart(2, "0")}`,
  };
}

// Bento grid spans
const GRID_SPANS = [
  "md:col-span-2",  // Backend — wide
  "md:col-span-1",  // Databases
  "md:col-span-3",  // AI & Agentic — full width (7 skills, featured)
  "md:col-span-1",  // Frontend
  "md:col-span-1",  // Infrastructure
  "md:col-span-1",  // E-Commerce
];

function SkillPill({ name, proficiency, tint, delay }) {
  const isFilled = proficiency >= 85;
  const isBordered = proficiency >= 75 && proficiency < 85;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="skill-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-body text-sm cursor-default"
      style={{
        background: isFilled ? tint.pill : "transparent",
        border: `1px solid ${isFilled ? tint.pillBorder : isBordered ? tint.pillBorder : "var(--t-slate-mid)"}`,
        color: isFilled || isBordered ? tint.text : "var(--t-text-secondary)",
      }}
    >
      {isFilled && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: tint.text }}
        />
      )}
      {name}
    </motion.span>
  );
}

function SkillCard({ category, index, gridSpan, isDark }) {
  const [ref, inView] = useInView();
  const Icon = ICONS[category.icon] || HiCode;
  const tint = getTints(category.icon, isDark);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative rounded-2xl p-6 overflow-hidden group hover:scale-[1.01] transition-transform ${gridSpan}`}
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${tint.bg}, var(--t-obsidian))`
          : `linear-gradient(135deg, ${tint.bg}, var(--t-void))`,
        border: `1px solid ${tint.border}`,
      }}
    >
      {/* Subtle corner glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ background: tint.text }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: tint.pill, border: `1px solid ${tint.pillBorder}`, color: tint.text }}
        >
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-display font-bold text-text-primary text-base">{category.title}</h3>
          <p className="font-mono text-xs" style={{ color: tint.text }}>{category.level}</p>
        </div>
      </div>

      {/* Skill pills */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {category.skills.map((skill, i) => (
          <SkillPill
            key={skill.name}
            name={skill.name}
            proficiency={skill.proficiency}
            tint={tint}
            delay={inView ? 0.1 + i * 0.06 : 0}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel
          label="Expertise"
          title="Technical Skills"
          subtitle="14+ years of production experience across the full stack, from databases to AI integration."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillCategories.map((cat, i) => (
            <SkillCard
              key={cat.title}
              category={cat}
              index={i}
              gridSpan={GRID_SPANS[i] || "md:col-span-1"}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono">Expert</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-4 h-px border-t border-accent/40" />
            <span className="font-mono">Strong</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-4 h-px border-t border-slate-mid/50" />
            <span className="font-mono">Proficient</span>
          </div>
        </div>
      </div>
    </section>
  );
}
