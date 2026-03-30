export default {
  slug: "ai-augmented-developer",
  title: "The AI-Augmented Developer Workflow",
  date: "2026-03-20",
  tags: ["AI", "Productivity", "Developer Tools"],
  summary:
    "My practical approach to using Claude, GPT, and agentic tools in daily development — what actually works and what doesn't.",
  content: `
## Not About Replacement

Let me get this out of the way: AI isn't replacing developers. Not good ones, anyway. What it's doing is creating a new category — the AI-augmented developer — who gets meaningfully more done by knowing when and how to leverage these tools. After a year of integrating AI into my daily workflow across multiple production projects, here's what I've actually learned.

## What Works Exceptionally Well

**Architecture and design discussions.** When I'm planning a new feature or system, I'll describe the constraints, existing stack, and requirements to Claude and use it as a sparring partner. It catches edge cases I miss, suggests patterns I haven't considered, and helps me think through tradeoffs. This is where I get the biggest ROI — not in code generation, but in design quality.

**Boilerplate and scaffolding.** Migration files, API resource classes, form request validators, test stubs — the structural code that follows predictable patterns. I describe what I need, get a first draft in seconds, and adjust from there. What used to take 30 minutes of copy-paste-modify takes 5 minutes of review-and-tweak.

**Code review and refactoring.** Pasting a function and asking "what's wrong with this?" or "how would you simplify this?" consistently surfaces improvements I wouldn't have spotted in my own review. It's like having a patient senior developer available 24/7 who never gets tired of looking at your code.

**Documentation.** Writing docs is the task most developers avoid. AI makes it almost painless — generate the first draft from the code, then edit for accuracy and tone. My documentation output has tripled.

## What Doesn't Work

**Complex business logic without deep context.** If the logic depends on understanding why a legacy fee structure has seventeen special cases accumulated over a decade, no amount of prompting will produce correct code. The AI doesn't know what it doesn't know, and business logic bugs are the most expensive kind.

**Security-critical code.** Authentication flows, encryption implementations, permission systems — I write these by hand and review them carefully. The cost of a subtle AI-generated vulnerability is too high.

**Debugging production issues blindly.** "Here's an error log, fix it" rarely works. Production debugging requires understanding system state, recent deployments, data patterns, and infrastructure context that can't be conveyed in a prompt.

## My Actual Daily Workflow

I've settled into a tool-specific pattern: **Claude** for architecture discussions, complex problem-solving, and writing content like this blog post. **GPT** for quick factual lookups and API reference questions. **Cursor** with Claude for refactoring existing code where the IDE context helps. **Agentic coding tools** (Claude Code, Codex) for scaffolding new features and running multi-file changes.

## The MCP Angle

One thing I'm genuinely excited about is the Model Context Protocol (MCP). This portfolio site itself exposes a WebMCP endpoint — structured data that AI agents can discover and consume. The idea is that your professional presence becomes machine-readable, not just human-readable. We're building for a world where AI agents browse and interact with services on behalf of users.

## Honest Assessment

For the right tasks, I see a genuine 2-3x productivity boost. But the key phrase is "for the right tasks." The developers who will thrive aren't the ones who pipe everything through AI — they're the ones who develop sharp judgment about when to use it and when to think for themselves. The tool amplifies your existing skill. If you don't understand what good code looks like, AI-generated code won't teach you. But if you do, it'll help you produce a lot more of it.
`,
};
