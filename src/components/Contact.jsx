import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { profile } from "../data/profile";
import SectionLabel from "./SectionLabel";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";

export default function Contact() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactInfo = [
    { icon: HiOutlineMail, label: "Email", value: profile.email, action: copyEmail, actionLabel: copied ? "Copied!" : "Copy" },
    ...(profile.phone ? [{ icon: HiOutlinePhone, label: "Phone", value: profile.phone }] : []),
    { icon: HiOutlineLocationMarker, label: "Location", value: profile.location },
    { icon: HiOutlineClock, label: "Timezone", value: `${profile.timezone} — Flexible for EU/US` },
  ];

  const socialLinks = [
    { icon: FaLinkedinIn, href: profile.social.linkedin, label: "LinkedIn", color: "#0077B5" },
    { icon: FaGithub, href: profile.social.github, label: "GitHub", color: "#fff" },
    { icon: SiUpwork, href: profile.social.upwork, label: "Upwork", color: "#14a800" },
  ];

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel
          label="Connect"
          title="Let's Work Together"
          subtitle="Open to international remote positions or relocation. Available for full-time roles or consulting."
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-10"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {contactInfo.map(({ icon: Icon, label, value, action, actionLabel }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-text-primary font-medium text-sm">{value}</p>
                  {action && (
                    <button onClick={action} className="text-xs text-accent hover:underline mt-0.5">
                      {actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="section-line mb-8" />

          {/* Social + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-12 h-12 rounded-xl bg-onyx border border-slate-mid flex items-center justify-center text-text-muted hover:border-accent/30 transition-all group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" style={{ color }} />
                </a>
              ))}
            </div>

            <a
              href={`mailto:${profile.email}?subject=Hello Haseeb — Let's Talk`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-void font-display font-bold rounded-full hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              <HiOutlineMail size={18} />
              Send Email
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
