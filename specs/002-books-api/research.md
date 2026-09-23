# Research: Books API

**Feature**: Books API | **Date**: 2026-09-23

## Decision Log

### 1. Storage Strategy

**Decision**: In-memory JavaScript Map keyed by UUID

**Rationale**: The existing project has no database dependency. Adding one would increase setup complexity disproportionate to the feature scope. An in-memory store is sufficient for the demo API and keeps the dependency footprint minimal.

**Alternatives considered**:
- SQLite via `better-sqlite3`: Adds persistence but introduces a native dependency, complicating cross-platform builds
- JSON file storage: Adds persistence but introduces file I/O complexity, concurrency risks, and slower writes at scale
- PostgreSQL/MySQL: Production-grade but overkill for a demo project with no existing DB infrastructure

### 2. Pagination Approach

**Decision**: Offset-based pagination with `page` and `limit` query parameters

**Rationale**: Simplest to implement and understand. The spec's scale target (10,000 books) is well within offset pagination's performance sweet spot. Default page size of 20, configurable via `limit` parameter (max 100).

**Alternatives considered**:
- Cursor-based pagination: Better for real-time data and very large datasets but more complex for clients and unnecessary at this scale
- Keyset pagination: Optimal for sorted large datasets but requires a stable sort key and adds implementation complexity

### 3. Filtering Approach

**Decision**: Query parameter filtering with exact match for author and genre, range support for publication year

**Rationale**: Covers the spec requirement (FR-009) for filtering by author, genre, and publication year. Exact matching is intuitive for string fields. Year filtering benefits from supporting both exact and range queries (e.g., `yearFrom`, `yearTo`).

**Alternatives considered**:
- Full-text search: Overkill for structured fields; would need a search library
- GraphQL filtering: Would require a framework change; out of scope

### 4. Validation Strategy

**Decision**: Custom validation middleware using a lightweight schema-check function

**Rationale**: The validation requirements are simple (required fields, type checks, length limits). A custom middleware avoids adding a dependency like Joi or Zod while keeping validation logic centralized and reusable.

**Alternatives considered**:
- Joi: Full-featured but adds a dependency tree for simple checks
- express-validator: Popular but heavier than needed for 6 fields
- Zod: TypeScript-first, less natural for a plain JS project

### 5. Identifier Format

**Decision**: UUIDs (v4) via the existing `uuid` package

**Rationale**: The `uuid` package is already in the project's dependencies. UUIDs are globally unique, unguessable, and don't leak sequence information.

**Alternatives considered**:
- Auto-incrementing integers: Simpler but leak ordering and total count
- nanoid: Compact but would add a new dependency

### 6. Error Response Format

**Decision**: Consistent JSON error envelope with `status`, `error`, and `message` fields; validation errors include a `details` array

**Rationale**: Matches common REST API conventions. The structured format satisfies FR-010 (consistent responses) and SC-003 (descriptive error messages).

**Alternatives considered**:
- RFC 7807 Problem Details: More formal but heavier for a demo API
- Plain text errors: Too simple; doesn't satisfy the structured response requirement

### 7. Testing Framework

**Decision**: Node.js built-in test runner (`node --test`) with the `assert` module

**Rationale**: Zero additional dependencies. Available in Node.js 18+ (LTS). Supports describe/it blocks, async tests, and built-in assertions. For integration tests, use Node's built-in `fetch` (Node 18+) to make HTTP requests against the running server.

**Alternatives considered**:
- Jest: Full-featured but heavy dependency; mocking utilities not needed here
- Mocha + Chai: Established but requires two dependencies for what the built-in runner covers
- Vitest: Fast but TypeScript-oriented and adds a dependency

## Resolved Clarifications

No NEEDS CLARIFICATION markers existed in the spec. All decisions above are informed defaults based on the existing project context and spec assumptions.
