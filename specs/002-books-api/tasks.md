# Tasks: Books API

**Input**: Design documents from `specs/002-books-api/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create directory structure: `backend/routes/`, `backend/services/`, `backend/middleware/`, `tests/unit/`, `tests/integration/`
- [x] T002 Add `express.json()` body-parsing middleware to `backend/server.js`
- [x] T003 Add `test` script to `backend/package.json` for `node --test`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure shared by all user stories

- [x] T004 Create Book service with in-memory store and UUID generation in `backend/services/bookService.js`
- [x] T005 Create validation middleware in `backend/middleware/validate.js`
- [x] T006 Create books router shell and register it in `backend/server.js` at `/api/books`

**Checkpoint**: Foundation ready — endpoint routing and data layer in place

---

## Phase 3: User Story 1 — List All Books (Priority: P1)

**Goal**: Consumers can retrieve a paginated, filterable list of all books

**Independent Test**: Request `/api/books` and verify paginated book collection is returned

### Implementation

- [x] T007 [US1] Implement `getAll(filters, pagination)` in `backend/services/bookService.js` with filtering (author, genre, yearFrom, yearTo) and offset pagination
- [x] T008 [US1] Implement `GET /api/books` route in `backend/routes/books.js` with query parameter parsing and pagination response envelope

**Checkpoint**: List endpoint functional with pagination and filtering

---

## Phase 4: User Story 2 — Fetch a Single Book (Priority: P1)

**Goal**: Consumers can retrieve full details of a specific book by ID

**Independent Test**: Request `/api/books/:id` for a known book and verify complete record returned

### Implementation

- [x] T009 [US2] Implement `getById(id)` in `backend/services/bookService.js`
- [x] T010 [US2] Implement `GET /api/books/:id` route in `backend/routes/books.js` with UUID validation and not-found handling

**Checkpoint**: Single-book fetch endpoint functional

---

## Phase 5: User Story 3 — Add a New Book (Priority: P2)

**Goal**: Administrators can add new books to the catalog

**Independent Test**: POST a new book and verify it appears in subsequent list/fetch requests

### Implementation

- [x] T011 [US3] Implement `create(bookData)` in `backend/services/bookService.js` with UUID assignment and timestamp generation
- [x] T012 [US3] Implement `POST /api/books` route in `backend/routes/books.js` with request body validation

**Checkpoint**: Create endpoint functional with validation

---

## Phase 6: User Story 4 — Update an Existing Book (Priority: P2)

**Goal**: Administrators can update book details

**Independent Test**: PUT updated fields for a known book and verify changes persist

### Implementation

- [x] T013 [US4] Implement `update(id, updates)` in `backend/services/bookService.js` with partial update support and updatedAt refresh
- [x] T014 [US4] Implement `PUT /api/books/:id` route in `backend/routes/books.js` with validation for at-least-one-field and not-found handling

**Checkpoint**: Update endpoint functional with partial updates

---

## Phase 7: User Story 5 — Delete a Book (Priority: P3)

**Goal**: Administrators can remove books from the catalog

**Independent Test**: DELETE a known book and verify it no longer appears in list/fetch

### Implementation

- [x] T015 [US5] Implement `delete(id)` in `backend/services/bookService.js` with hard delete
- [x] T016 [US5] Implement `DELETE /api/books/:id` route in `backend/routes/books.js` with not-found handling

**Checkpoint**: Delete endpoint functional

---

## Phase 8: Polish & Validation

**Purpose**: Tests, error handling refinement, and end-to-end validation

- [x] T017 [P] Write unit tests for bookService in `tests/unit/bookService.test.js`
- [x] T018 [P] Write integration tests for all endpoints in `tests/integration/books.api.test.js`
- [x] T019 Run quickstart.md validation scenarios and verify all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phases 3–4 (P1 stories)**: Depend on Phase 2, can run in parallel
- **Phases 5–6 (P2 stories)**: Depend on Phase 2, can run in parallel with each other
- **Phase 7 (P3 story)**: Depends on Phase 2
- **Phase 8 (Polish)**: Depends on all story phases

### Within Each Story

- Service methods before routes
- Routes wire up to existing service methods
