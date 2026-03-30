export default {
  slug: "galera-clustering-production",
  title: "MariaDB Galera Clustering in Production: Lessons Learned",
  date: "2026-02-28",
  tags: ["MySQL", "Database", "High Availability"],
  summary:
    "What I learned running active-active database replication for a platform serving millions of records.",
  content: `
## Why Galera

When you're running a nationwide platform that dozens of regional offices depend on every working day, downtime isn't an option anyone wants to discuss. The system I was responsible for served 50+ locations, and the previous single-server MySQL setup meant that every maintenance window was a negotiation with stakeholders who didn't want their operations interrupted.

We needed active-active replication — not just for failover, but because geographically distributed offices needed low-latency reads and writes. Galera's synchronous multi-master replication was the right fit: every node can accept writes, and data consistency is guaranteed through certification-based conflict resolution.

## The Setup

Our production cluster runs three MariaDB Galera nodes. The configuration itself is straightforward — set the \`wsrep_cluster_address\`, configure \`wsrep_sst_method\` (we use mariabackup for state snapshot transfers), tune \`innodb_buffer_pool_size\` per node, and you're replicating.

But "straightforward" in documentation and "straightforward" in production are very different things.

## The Gotchas Nobody Warns You About

**Certification conflicts** were our first surprise. Galera uses optimistic concurrency — transactions execute locally and then get certified across the cluster. If two nodes modify the same row simultaneously, one transaction gets rolled back. In a single-master setup, your application never sees this. In multi-master, your application code needs retry logic for deadlock errors that never existed before.

**Large transactions are the enemy.** We had a batch job that updated 500,000 records in a single transaction. On a standalone server, it ran fine. On Galera, it choked the cluster — the write-set was too large to replicate efficiently, and other nodes experienced flow control pauses. The fix: break batch operations into chunks of 1,000-5,000 rows with commits between them.

**SST donor selection** matters more than you think. When a node crashes and rejoins, it needs a full state transfer from a donor node. If Galera picks your busiest node as the donor, that node's performance tanks during the transfer. We learned to configure \`wsrep_sst_donor\` explicitly and keep one node slightly less loaded for this purpose.

## The 10M Record Migration

The real test came when we migrated 10 million records from a legacy MSSQL database into our MariaDB Galera cluster. A migration of this scale on a live cluster required careful planning.

Our approach was a dual-write strategy. We set up the migration to write in batches of 5,000 records, with validation checksums computed after each batch. The application continued serving reads from the existing data while new records flowed in. We wrote validation scripts that compared source and destination counts, checksums, and sampled individual records for field-level accuracy.

The result: zero data loss, zero downtime, and a migration that completed over a weekend while the team monitored dashboards from home.

## Monitoring That Actually Matters

Forget generic MySQL monitoring. For Galera, these are the metrics that predict problems before they hit:

- **wsrep_flow_control_paused**: If this goes above 0.1, a node is struggling to keep up
- **wsrep_local_recv_queue_avg**: Growing queues mean replication is falling behind
- **wsrep_cert_deps_distance**: Low values indicate serialization bottlenecks
- **wsrep_local_state_comment**: Anything other than "Synced" needs immediate attention

## Production Lessons

After running Galera in production for several years, my advice is simple: keep transactions small, avoid write hotspots on single rows, test failover quarterly (not just once during setup), and always have a node ready to be an SST donor. Galera is excellent technology, but it rewards you for understanding its replication model rather than treating it as a drop-in replacement for single-server MySQL.
`,
};
