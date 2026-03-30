export default {
  slug: "bridging-legacy-with-ai",
  title: "Bridging Legacy Systems with Modern AI",
  date: "2026-03-15",
  tags: ["AI Integration", "Laravel", "LLM"],
  summary:
    "How I integrated LLM-powered capabilities into a 15-year-old warehouse management system at Crosslog International.",
  content: `
## The Challenge

When I joined the Crosslog International project, I inherited a warehouse management system that had been running for over 15 years. We're talking raw PHP in some modules, a monolithic architecture, and a support team that handled thousands of tickets daily by copy-pasting from a shared Google Doc of canned responses. The codebase worked — it processed 20,000+ orders per day — but it was showing its age in every customer interaction.

The team was skeptical when I proposed integrating AI. "We've seen chatbots before," the operations lead told me. "They just make customers angrier." He wasn't wrong about most chatbot implementations. But I wasn't proposing a chatbot.

## Starting Small: Email Drafting

Instead of trying to replace anything, I started with the lowest-risk, highest-visibility win: AI-assisted email drafting for the support team. The idea was simple — given a customer complaint and the order history, generate a draft response that the support agent could edit and send.

I built a Laravel service layer that wrapped the Claude API. The service pulled order data, shipping status, and previous correspondence from our existing MySQL database, then constructed a prompt with all that context. The support agent would click "Draft Response," review the output, make any edits, and send. No automation without human approval.

Adoption was immediate. The support team went from spending significant time per email to quick review-and-send cycles. They weren't being replaced — they were being freed from the mechanical parts of their job.

## Expanding to Knowledge Base RAG

With that trust established, I tackled the bigger problem: the team's institutional knowledge was scattered across Google Docs, Slack threads, and people's heads. When a senior agent left, their expertise walked out the door with them.

I built a RAG (Retrieval-Augmented Generation) pipeline. We indexed all existing documentation, SOPs, and resolved ticket histories into chunks and used the LLM's embedding API to generate vectors. At our scale — a few thousand documents — we didn't need a dedicated vector database. We stored the embeddings alongside the document chunks and performed similarity lookups in application memory at query time using a simple Laravel service. When a support agent encountered an unfamiliar issue, the system would search for semantically similar past resolutions and present them alongside an AI-generated suggestion.

The pragmatic choice here mattered: a full vector database like Pinecone or Qdrant would have been overkill for our corpus size and added operational complexity the team wasn't ready for. Keeping it in application code meant any Laravel developer on the team could debug and maintain it.

## Technical Architecture

The implementation was deliberately conservative:

- **Service Layer**: A clean Laravel service class wrapping LLM API calls with retry logic, token budgeting, and fallback chains (Claude primary, GPT-4 fallback, template-based last resort)
- **Embedding & Search**: Document chunks with precomputed embeddings, loaded into memory at service boot, cosine similarity computed in PHP — fast enough for a few thousand documents
- **Prompt Engineering**: Carefully constructed system prompts with company tone guidelines, escalation rules, and strict instructions to never fabricate order information
- **Audit Trail**: Every AI-generated response logged with the prompt, model used, and agent edits for quality review

## The Takeaway

The support team adopted the tools within the first week, and the consistency of responses improved noticeably based on QA sampling. But the real lesson wasn't about metrics. It was about approach.

AI integration isn't about replacing legacy systems — it's about finding the seams where intelligence can be injected without disrupting what already works. Start with augmentation, earn trust through small wins, and let adoption happen organically. The 15-year-old codebase is still running. It just got a bit smarter.
`,
};
