import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import posts from "../data/blog/index.js";
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi";

/* ── Simple Markdown-to-HTML renderer ────────────────────────────── */

function markdownToHtml(md) {
  let html = md;

  // Normalize line endings
  html = html.replace(/\r\n/g, "\n");

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="blog-code-block"><code class="language-${lang || "text"}">${escaped}</code></pre>`;
  });

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="blog-inline-code">$1</code>'
  );

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-img" />');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1</a>'
  );

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="blog-hr" />');

  // Process block-level elements line by line
  const lines = html.split("\n");
  const result = [];
  let inList = false;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        result.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      result.push(
        `<h${level} id="${id}" class="blog-h${level}">${text}</h${level}>`
      );
      continue;
    }

    // Unordered list items
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) result.push("</ol>");
        result.push('<ul class="blog-ul">');
        inList = true;
        listType = "ul";
      }
      result.push(`<li>${ulMatch[1]}</li>`);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) result.push("</ul>");
        result.push('<ol class="blog-ol">');
        inList = true;
        listType = "ol";
      }
      result.push(`<li>${olMatch[1]}</li>`);
      continue;
    }

    // Close list if we hit a non-list line
    if (inList && line.trim() !== "") {
      result.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
      listType = null;
    }

    // Blockquotes
    const bqMatch = line.match(/^>\s*(.*)$/);
    if (bqMatch) {
      result.push(`<blockquote class="blog-blockquote">${bqMatch[1]}</blockquote>`);
      continue;
    }

    // Paragraphs (non-empty, non-html lines)
    if (line.trim() && !line.trim().startsWith("<")) {
      result.push(`<p class="blog-p">${line}</p>`);
    } else if (line.trim().startsWith("<")) {
      result.push(line);
    }
  }

  if (inList) {
    result.push(listType === "ul" ? "</ul>" : "</ol>");
  }

  return result.join("\n");
}

/* ── Extract headings for table of contents ──────────────────────── */

function extractHeadings(md) {
  const headings = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ level, text, id });
    }
  }
  return headings;
}

/* ── Helpers ─────────────────────────────────────────────────────── */

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

/* ── Component ───────────────────────────────────────────────────── */

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const htmlContent = useMemo(
    () => (post ? markdownToHtml(post.content) : ""),
    [post]
  );

  const headings = useMemo(
    () => (post ? extractHeadings(post.content) : []),
    [post]
  );

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-void pt-24 pb-16 px-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-8 group"
        >
          <HiOutlineArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Portfolio
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-text-secondary mb-6">{post.summary}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-text-muted font-mono">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineCalendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineClock size={14} />
              {readingTime(post.content)} min read
            </span>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-accent/40 via-accent/10 to-transparent" />
        </header>

        {/* Table of contents */}
        {headings.length > 2 && (
          <nav className="glass rounded-xl p-5 mb-10">
            <h2 className="font-display font-bold text-sm text-text-primary mb-3 uppercase tracking-wider">
              Table of Contents
            </h2>
            <ul className="space-y-1.5">
              {headings.map((h) => (
                <li
                  key={h.id}
                  style={{ paddingLeft: `${(h.level - 2) * 16}px` }}
                >
                  <a
                    href={`#${h.id}`}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-mid/20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all font-medium"
          >
            <HiOutlineArrowLeft size={14} />
            Back to Portfolio
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
