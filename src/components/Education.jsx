import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { education, certifications } from "../data/education";
import SectionLabel from "./SectionLabel";
import { HiAcademicCap, HiOutlineBadgeCheck, HiOutlineBookOpen } from "react-icons/hi";

function EducationCard({ edu, index }) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Gold medal accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full" />

      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          <HiAcademicCap size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-lg text-text-primary">{edu.degree}</h3>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/20">
              {edu.honor}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{edu.school}</p>
          <p className="text-xs text-text-muted font-mono mt-1">{edu.period} · {edu.location}</p>
        </div>
      </div>

      <div className="pl-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-sm text-accent font-medium">CGPA: {edu.gpa}</span>
        </div>

        {edu.thesis && (
          <p className="text-sm text-text-secondary mb-2">
            <span className="text-text-muted">Thesis:</span> {edu.thesis}
          </p>
        )}

        {(edu.publications || (edu.publication ? [edu.publication] : [])).map((pub, i) => (
          <div key={i} className="mt-3 p-3 rounded-lg bg-onyx/50 border border-accent/10">
            <div className="flex items-center gap-2 text-xs text-accent mb-1">
              <HiOutlineBookOpen size={14} />
              <span className="font-mono uppercase tracking-wide">IEEE Publication</span>
            </div>
            <p className="text-sm text-text-secondary italic">"{pub.title}"</p>
            <p className="text-xs text-text-muted mt-1">{pub.journal}, {pub.year}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Education() {
  const [ref, inView] = useInView();

  return (
    <section id="education" className="py-24 px-6 bg-obsidian/50">
      <div className="max-w-4xl mx-auto">
        <SectionLabel
          label="Academic"
          title="Education & Achievements"
          subtitle="Double gold medalist with an IEEE publication in distributed systems."
        />

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {education.map((edu, i) => (
            <EducationCard key={edu.degree} edu={edu} index={i} />
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm glass rounded-full text-text-secondary"
            >
              <HiOutlineBadgeCheck className="text-accent" size={16} />
              {cert}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
