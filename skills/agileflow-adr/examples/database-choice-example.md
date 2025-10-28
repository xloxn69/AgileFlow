# [ADR-012] Use PostgreSQL for Primary Database

**Date**: 2025-01-15
**Status**: Accepted
**Deciders**: Tech Lead, Backend Team, DevOps
**Tags**: database, architecture, backend

## Context and Problem Statement

Our application needs a primary database to store user data, transactions, and analytics. We need to choose a database that supports complex queries, transactions, and can scale with our growing user base (currently 10K users, expecting 100K+ within 6 months).

## Decision Drivers

- **Strong ACID compliance** - Financial transactions require data integrity
- **Complex query support** - Analytics require joins and aggregations
- **Team expertise** - Team has SQL experience but limited NoSQL experience
- **Cost** - Must fit within infrastructure budget (~$200/month)
- **Scalability** - Need to handle 10x growth over 6 months
- **Operational overhead** - Limited DevOps resources for maintenance

## Considered Options

- PostgreSQL
- MongoDB
- MySQL

## Decision Outcome

**Chosen option**: PostgreSQL

**Justification**: PostgreSQL offers the best balance of ACID compliance, query flexibility, and team expertise. While MongoDB could handle our document-like user profiles well, the financial transaction requirements demand strong consistency guarantees. PostgreSQL's JSON support gives us flexibility for semi-structured data without sacrificing transactional integrity.

### Positive Consequences

- Strong ACID guarantees protect financial data
- Team can leverage existing SQL knowledge immediately
- Rich ecosystem of tools (pg Admin, extensions, ORMs)
- JSON/JSONB support provides flexibility for evolving schemas
- Excellent performance for our expected load (<1M rows initially)
- Free and open source - no licensing costs
- Proven scalability path (read replicas, partitioning, Citus extension)

### Negative Consequences

- Vertical scaling limits eventually require sharding strategy
- Less flexible schema changes compared to schema-less databases
- Requires careful query optimization for complex analytics
- Team needs to learn PostgreSQL-specific features (JSONB, window functions)

## Pros and Cons of the Options

### PostgreSQL

**Pros**:
- ✅ Strong ACID compliance with serializable isolation
- ✅ Excellent support for complex queries (JOINs, CTEs, window functions)
- ✅ JSONB for flexible semi-structured data
- ✅ Rich extension ecosystem (PostGIS, pg_trgm, etc.)
- ✅ Free and open source
- ✅ Battle-tested at scale (Instagram, Spotify, GitHub use it)
- ✅ Team has SQL experience

**Cons**:
- ❌ Vertical scaling limits (~10M rows before needing partitioning)
- ❌ Schema migrations require downtime for large tables
- ❌ Write performance lower than NoSQL for high-throughput scenarios
- ❌ Replication complexity for multi-region deployment

### MongoDB

**Pros**:
- ✅ Flexible schema for rapidly evolving data models
- ✅ Horizontal scaling built-in (sharding)
- ✅ Fast writes for high-throughput scenarios
- ✅ Good for document-oriented data (user profiles, products)
- ✅ Built-in replication and failover

**Cons**:
- ❌ Weaker consistency guarantees (eventual consistency by default)
- ❌ Limited transaction support (only multi-document ACID since v4.0)
- ❌ Team has no MongoDB experience (3-6 month learning curve)
- ❌ More expensive managed hosting (~$400/month vs $200 for PostgreSQL)
- ❌ Complex queries less efficient (no JOINs)
- ❌ Analytics require aggregation pipeline (steep learning curve)

### MySQL

**Pros**:
- ✅ Strong ACID compliance
- ✅ Widely used and well-documented
- ✅ Team has SQL experience
- ✅ Good performance for read-heavy workloads
- ✅ Free and open source

**Cons**:
- ❌ Weaker JSON support compared to PostgreSQL
- ❌ Less feature-rich (no CTEs until v8.0, weaker window functions)
- ❌ Replication can be complex (binlog issues)
- ❌ Extension ecosystem less rich than PostgreSQL
- ❌ Oracle ownership concerns (licensing changes)

## Links

- [PostgreSQL JSON Support](https://www.postgresql.org/docs/current/datatype-json.html)
- [Scalability Guide](docs/architecture/postgres-scaling.md)
- [Database Schema Design](docs/architecture/schema-design.md)
- Related: [ADR-013: Use Prisma ORM](./ADR-013-use-prisma-orm.md)

## Notes

- **Migration path**: If we hit PostgreSQL scaling limits (>10M users), we'll evaluate:
  1. Citus extension for horizontal scaling
  2. Read replicas for read-heavy queries
  3. Vertical scaling to larger instances

- **Review date**: 2025-06-15 (6 months) - Assess if decision still holds with actual usage data

- **Monitoring**: Set up alerts for:
  - Query performance degradation
  - Table size growth
  - Replication lag
  - Connection pool exhaustion
