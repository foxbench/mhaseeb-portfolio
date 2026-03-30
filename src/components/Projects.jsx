import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { projects } from "../data/projects";
import SectionLabel from "./SectionLabel";
import { HiOutlineExternalLink } from "react-icons/hi";

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform"
    >
      {/* Color accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className="inline-block px-2.5 py-0.5 text-xs font-mono rounded-full mb-2 border"
              style={{ color: project.color, borderColor: `${project.color}30`, backgroundColor: `${project.color}10` }}
            >
              {project.category}
            </span>
            <h3 className="font-display font-bold text-xl text-text-primary">{project.title}</h3>
            <p className="text-sm text-accent/70 font-medium">{project.client}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-5">{project.description}</p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-3 mb-5">
          {project.metrics.map((m) => (
            <span key={m} className="px-3 py-1 text-xs font-mono rounded-lg bg-onyx border border-slate-mid text-text-secondary">
              {m}
            </span>
          ))}
        </div>

        {/* Tech */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs font-mono text-text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel
          label="Portfolio"
          title="Featured Projects"
          subtitle="Government platforms, AI-powered systems, and e-commerce at scale."
        />

        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {visible.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {projects.length > 4 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 text-sm font-mono text-accent border border-accent/20 rounded-full hover:bg-accent/10 transition-colors"
            >
              {showAll ? "Show Less" : `View All ${projects.length} Projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
