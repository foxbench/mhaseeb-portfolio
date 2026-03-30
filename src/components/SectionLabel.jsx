import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

export default function SectionLabel({ label, title, subtitle }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 mb-4"
      >
        <span className="w-8 h-px bg-accent/40" />
        <span className="font-mono text-xs text-accent uppercase tracking-[0.2em]">{label}</span>
        <span className="w-8 h-px bg-accent/40" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-text-secondary max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
