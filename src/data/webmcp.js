import { profile } from "./profile";
import { experience } from "./experience";
import { skillCategories } from "./skills";
import { projects } from "./projects";
import { education } from "./education";

/**
 * WebMCP (Web Model Context Protocol) tools registration
 * Exposes portfolio data as structured tools that AI agents can discover and call.
 * This makes the portfolio machine-readable and AI-agent-friendly.
 */
export const mcpTools = [
  {
    name: "getProfile",
    description: "Get Muhammad Haseeb's professional profile summary including bio, location, availability, and key stats",
    parameters: {},
    handler: () => ({
      name: profile.name,
      title: profile.title,
      subtitle: profile.subtitle,
      bio: profile.bio,
      location: profile.location,
      timezone: profile.timezone,
      availability: profile.availability,
      stats: profile.stats,
      social: profile.social,
    }),
  },
  {
    name: "getSkills",
    description: "Get technical skills organized by category with proficiency levels",
    parameters: {
      category: {
        type: "string",
        description: "Optional filter by category name (e.g., 'Backend', 'AI', 'Frontend')",
        required: false,
      },
    },
    handler: (params) => {
      if (params?.category) {
        const filtered = skillCategories.filter((c) =>
          c.title.toLowerCase().includes(params.category.toLowerCase())
        );
        return filtered.length ? filtered : { error: "Category not found", available: skillCategories.map((c) => c.title) };
      }
      return skillCategories;
    },
  },
  {
    name: "searchProjects",
    description: "Search portfolio projects by keyword, technology, or category",
    parameters: {
      query: {
        type: "string",
        description: "Search term to filter projects (matches title, description, tech stack, or category)",
        required: false,
      },
    },
    handler: (params) => {
      if (!params?.query) return projects;
      const q = params.query.toLowerCase();
      return projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    },
  },
  {
    name: "getExperience",
    description: "Get professional work experience timeline",
    parameters: {
      company: {
        type: "string",
        description: "Optional filter by company name",
        required: false,
      },
    },
    handler: (params) => {
      if (params?.company) {
        return experience.filter((e) =>
          e.company.toLowerCase().includes(params.company.toLowerCase())
        );
      }
      return experience;
    },
  },
  {
    name: "getEducation",
    description: "Get education history, degrees, GPA, and publications",
    parameters: {},
    handler: () => education,
  },
  {
    name: "getContactInfo",
    description: "Get contact information and availability for hiring",
    parameters: {},
    handler: () => ({
      email: profile.email,
      website: profile.website,
      social: profile.social,
      availability: profile.availability,
      location: profile.location,
      timezone: profile.timezone,
      openTo: "International remote jobs or relocation with family",
    }),
  },
];

/**
 * Process an MCP tool call
 */
export function handleMcpCall(toolName, params = {}) {
  const tool = mcpTools.find((t) => t.name === toolName);
  if (!tool) {
    return { error: `Tool '${toolName}' not found`, availableTools: mcpTools.map((t) => t.name) };
  }
  return tool.handler(params);
}

/**
 * Generate the MCP manifest for discovery
 */
export function getMcpManifest() {
  return {
    schema_version: "1.0",
    name: "mhaseeb-portfolio",
    description: "Muhammad Haseeb's professional portfolio — AI Integration Engineer & Senior Full-Stack Developer",
    tools: mcpTools.map(({ name, description, parameters }) => ({
      name,
      description,
      inputSchema: {
        type: "object",
        properties: parameters,
      },
    })),
  };
}
