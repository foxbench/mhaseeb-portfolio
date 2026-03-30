import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { Link } from "react-router-dom";
import SectionLabel from "./SectionLabel";
import posts from "../data/blog/index.js";
import { HiOutlineArrowRight, HiOutlineClock } from "react-icons/hi";

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post, index }) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group"
    >
      {/* Accent corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full" />

      {/* Date + reading time */}
      <div className="flex items-center gap-3 mb-3 text-xs font-mono text-text-muted">
        <span>{formatDate(post.date)}</span>
        <span className="w-1 h-1 rounded-full bg-text-muted" />
        <span className="inline-flex items-center gap-1">
          <HiOutlineClock size={12} />
          {readingTime(post.content)} min read
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors">
        {post.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-text-secondary mb-4 flex-1">{post.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Read more */}
      <Link
        to={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all font-medium"
      >
        Read More <HiOutlineArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

export default function BlogList() {
  const displayPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel
          label="Writing"
          title="Blog"
          subtitle="Technical deep-dives and lessons from production systems."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {displayPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
