import bridgingLegacy from "./bridging-legacy-with-ai.js";
import galeraClustering from "./galera-clustering-production.js";
import aiAugmented from "./ai-augmented-developer.js";

const posts = [bridgingLegacy, galeraClustering, aiAugmented];

// Sort by date, newest first
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

export default posts;
