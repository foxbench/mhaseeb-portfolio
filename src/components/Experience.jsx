import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { experience } from "../data/experience";
import SectionLabel from "./SectionLabel";

function TimelineItem({ exp, index }) {
  const [ref, inView] = useInView();
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-3 bottom-0 w-px bg-gradient-to-b from-accent/40 to-transparent group-last:hidden" />

      {/* Dot */}
      <div className="absolute left-0 top-2 w-[23px] h-[23px] rounded-full border-2 border-accent/40 bg-void flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-6 hover:scale-[1.01] transition-transform">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-text-primary">{exp.role}</h3>
            <p className="text-accent text-sm font-medium">{exp.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/20">
              {exp.type}
            </span>
            <span className="text-xs text-text-muted font-mono">{exp.period}</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4">{exp.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {exp.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-onyx border border-slate-mid text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="text-xs text-accent/70 font-mono">
          {exp.highlight}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-obsidian/50">
      <div className="max-w-3xl mx-auto">
        <SectionLabel
          label="Career"
          title="Work Experience"
          subtitle="From government-scale platforms to AI-powered e-commerce — a trajectory of increasing complexity."
        />
        <div className="mt-8">
          {experience.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
