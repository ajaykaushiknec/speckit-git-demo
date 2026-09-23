# Quickstart: Books API Validation Guide

**Feature**: Books API | **Date**: 2026-09-23

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`cd backend && npm install`)

## Start the Server

```bash
cd backend
npm start
```

Server starts at `http://localhost:3000`.

## Validation Scenarios

Run these commands in a separate terminal to validate the feature end-to-end. All endpoints and response formats are defined in [contracts/books-api.md](./contracts/books-api.md).

### 1. Create a Book (POST)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "publicationYear": 1925, "genre": "Fiction", "description": "A novel about the American dream."}'
```

**Expected**: `201 Created` with the book object including a generated `id`, `createdAt`, and `updatedAt`.

### 2. Create a Second Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "1984", "author": "George Orwell", "publicationYear": 1949, "genre": "Dystopian"}'
```

**Expected**: `201 Created` with a different `id` than the first book.

### 3. List All Books (GET)

```bash
curl http://localhost:3000/api/books
```

**Expected**: `200 OK` with both books in `data` array and `pagination` metadata showing `totalItems: 2`.

### 4. Filter Books by Author

```bash
curl "http://localhost:3000/api/books?author=orwell"
```

**Expected**: `200 OK` with only "1984" in the results (case-insensitive partial match).

### 5. Fetch a Single Book (GET by ID)

Use the `id` from step 1:

```bash
curl http://localhost:3000/api/books/<id-from-step-1>
```

**Expected**: `200 OK` with the complete book record.

### 6. Update a Book (PUT)

```bash
curl -X PUT http://localhost:3000/api/books/<id-from-step-1> \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated description for The Great Gatsby."}'
```

**Expected**: `200 OK` with the book showing the new description and an updated `updatedAt` timestamp.

### 7. Delete a Book (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/books/<id-from-step-1>
```

**Expected**: `200 OK` with a deletion confirmation message.

### 8. Verify Deletion

```bash
curl http://localhost:3000/api/books/<id-from-step-1>
```

**Expected**: `404 Not Found` with error response.

### 9. Validation Error — Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"genre": "Fiction"}'
```

**Expected**: `400 Bad Request` with `VALIDATION_ERROR` and details listing missing `title` and `author`.

### 10. Not Found — Invalid ID

```bash
curl http://localhost:3000/api/books/00000000-0000-0000-0000-000000000000
```

**Expected**: `404 Not Found`.

## Run Automated Tests

```bash
cd tests
node --test unit/bookService.test.js
node --test integration/books.api.test.js
```

**Expected**: All tests pass with zero failures.

## Traceability

| Validation Scenario | Spec Requirement | User Story |
|---------------------|------------------|------------|
| 1–2. Create books   | FR-003, FR-008   | US-3       |
| 3. List books        | FR-001           | US-1       |
| 4. Filter books      | FR-009           | US-1       |
| 5. Fetch single book | FR-002           | US-2       |
| 6. Update book       | FR-005           | US-4       |
| 7–8. Delete book     | FR-006           | US-5       |
| 9. Validation error  | FR-004, FR-010   | US-3       |
| 10. Not found        | FR-007, FR-010   | US-2       |
