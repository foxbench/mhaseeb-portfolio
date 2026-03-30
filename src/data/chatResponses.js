import { profile } from "./profile";
import { experience } from "./experience";
import { skillCategories } from "./skills";
import { projects } from "./projects";

const RESPONSES = {
  greeting: {
    text: `Hey! I'm Haseeb's AI assistant. Ask me anything about his work, skills, or what he's been building.`,
    suggestions: ["Who is Haseeb?", "What does he build?", "AI experience", "Homelab setup"],
  },
  about: {
    text: `**Haseeb** — 14+ years building production systems. Double gold medalist, IEEE published. Currently juggling a govt MIS (React/Node.js) and AI-powered e-commerce integrations. Runs a homelab with a 3090 for fun.

Want to know about his skills, projects, or something specific?`,
    suggestions: ["Technical skills", "Current work", "Projects", "Education"],
  },
  skills: {
    text: `**Core stack:** PHP/Laravel (10+ yr expert), MySQL/MariaDB (production DBA), React, Node.js, Vue.js

**AI side:** LLM APIs (Claude/GPT), RAG systems, MCP, agentic frameworks

**Infra:** Docker, Proxmox, Linux, OPNsense — runs his own homelab too.

Which area interests you?`,
    suggestions: ["AI experience", "Database expertise", "Homelab", "Projects"],
  },
  experience: {
    text: `**Quick timeline:**
${experience.map((e) => `• **${e.role}** @ ${e.company} _(${e.period})_`).join("\n")}
Plus **5K+ hours** freelancing on Upwork.

Want details on any role?`,
    suggestions: ["Current role at FAB", "Crosslog work", "Bureau of Emigration", "Freelance"],
  },
  projects: {
    text: `**Highlights:**
${projects.slice(0, 4).map((p) => `• **${p.title}** — ${p.metrics[0]}`).join("\n")}

Want to dig into any of these?`,
    suggestions: ["AI Knowledge Base", "E-Commerce Hub", "FAB MIS", "Freelance work"],
  },
  education: {
    text: `**Double Gold Medalist** — MS from NUST (3.90) and BS from BZU (3.91). **2x IEEE published** — IoT Journal (2019) and FIT Conference on cloud recommendation systems (2016).

Strong academics, but 14 years of production experience is what he leads with.`,
    suggestions: ["Skills", "Projects", "Current work"],
  },
  ai: {
    text: `Haseeb builds **production AI systems**, not just prompts. At Crosslog he built a RAG knowledge base and AI email drafting with Claude/GPT APIs. This portfolio itself has WebMCP with 6 tools for AI agents.

He's deep into agentic workflows, MCP, and AI-augmented dev.`,
    suggestions: ["RAG system details", "WebMCP portfolio", "Skills", "Contact"],
  },
  homelab: {
    text: `Runs a multi-server homelab — **Proxmox** VMs with **RTX 3090** GPU passthrough for AI workloads, **TrueNAS** on HP MicroServer for storage, **OPNsense** firewall, Docker monitoring stack.

Self-taught through tutorials and tinkering. It's how he stays sharp on infra.`,
    suggestions: ["Infrastructure skills", "AI experience", "Current work at FAB"],
  },
  contact: {
    text: `**Reach out:**
[contact@mhaseeb.com](mailto:contact@mhaseeb.com) · [LinkedIn](${profile.social.linkedin}) · [GitHub](${profile.social.github}) · [Upwork](${profile.social.upwork})

Open to international remote or relocation. UTC+5, flexible overlap.`,
    suggestions: ["About Haseeb", "Skills", "Projects"],
  },
  resume: {
    text: `**Quick pitch:** 14+ years full-stack, double gold medalist, IEEE published. 150+ Upwork projects at 100% JSS. Builds production AI systems and manages enterprise platforms at scale.

For the full resume: [contact@mhaseeb.com](mailto:contact@mhaseeb.com)`,
    suggestions: ["Experience", "AI experience", "Contact"],
  },
  fab: {
    text: `At FAB, Haseeb is the **solo developer and manager** of their MIS — built with **React, Node.js, and MSSQL**. Migrated data from legacy Excel and file-based systems.

Currently setting up dedicated VMs to bring hosting in-house — full architecture and deployment planning.`,
    suggestions: ["Other experience", "Infrastructure skills", "Homelab"],
  },
  fallback: {
    text: `Not sure I caught that. Try one of these:`,
    suggestions: ["Who is Haseeb?", "Skills & expertise", "Current work", "Projects", "AI experience", "Homelab", "Contact"],
  },
};

const KEYWORD_MAP = {
  about: ["about", "who", "tell me", "introduce", "haseeb", "yourself", "bio", "summary"],
  skills: ["skills", "tech", "stack", "technologies", "expertise", "languages", "capable", "proficient"],
  experience: ["experience", "work", "career", "job", "history", "employment", "timeline", "worked"],
  projects: ["projects", "portfolio", "built", "samples", "showcase", "featured"],
  education: ["education", "degree", "university", "academic", "gold medalist", "publication", "ieee", "nust", "bzu"],
  ai: ["ai", "artificial intelligence", "llm", "machine learning", "claude", "gpt", "rag", "knowledge base", "agentic", "mcp"],
  homelab: ["homelab", "home lab", "proxmox", "truenas", "opnsense", "pfsense", "3090", "gpu", "self-host", "server rack"],
  fab: ["fab", "frequency", "allocation", "current role", "current job", "government job"],
  contact: ["contact", "email", "phone", "reach", "hire", "connect", "linkedin", "github", "upwork", "available"],
  resume: ["resume", "cv", "download", "pdf"],
  greeting: ["hi", "hello", "hey", "sup", "yo", "start", "help", "menu"],
};

export function getResponse(input) {
  const lower = input.toLowerCase().trim();

  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return RESPONSES[key];
    }
  }

  return RESPONSES.fallback;
}

export function getGreeting() {
  return RESPONSES.greeting;
}
