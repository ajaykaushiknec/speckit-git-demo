# API Contract: Books API

**Base Path**: `/api/books`

## Response Envelope

All responses follow a consistent structure.

### Success Response

```json
{
  "status": "success",
  "data": { ... }
}
```

### Success Response (List)

```json
{
  "status": "success",
  "data": [ ... ],
  "pagination": {
    "totalItems": 100,
    "totalPages": 5,
    "currentPage": 1,
    "pageSize": 20
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": "NOT_FOUND",
  "message": "Book with id '...' not found"
}
```

### Validation Error Response

```json
{
  "status": "error",
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

---

## Endpoints

### GET /api/books

List all books with optional pagination and filtering.

**Query Parameters**:

| Parameter | Type    | Default | Description                          |
|-----------|---------|---------|--------------------------------------|
| page      | Integer | 1       | Page number (min 1)                  |
| limit     | Integer | 20      | Items per page (min 1, max 100)      |
| author    | String  | —       | Filter by author (case-insensitive partial match) |
| genre     | String  | —       | Filter by genre (case-insensitive exact match) |
| yearFrom  | Integer | —       | Minimum publication year (inclusive)  |
| yearTo    | Integer | —       | Maximum publication year (inclusive)  |

**Success Response**: `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "publicationYear": 1925,
      "genre": "Fiction",
      "description": "A novel about the American dream...",
      "createdAt": "2026-09-23T10:00:00.000Z",
      "updatedAt": "2026-09-23T10:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 20
  }
}
```

**Error Responses**:

| Status | Error Code        | When                                     |
|--------|-------------------|------------------------------------------|
| 400    | VALIDATION_ERROR  | Invalid page/limit values (non-numeric, < 1, limit > 100) |

---

### GET /api/books/:id

Fetch a single book by its identifier.

**Path Parameters**:

| Parameter | Type   | Description           |
|-----------|--------|-----------------------|
| id        | String | UUID of the book      |

**Success Response**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "genre": "Fiction",
    "description": "A novel about the American dream...",
    "createdAt": "2026-09-23T10:00:00.000Z",
    "updatedAt": "2026-09-23T10:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Error Code  | When                                |
|--------|-------------|-------------------------------------|
| 400    | INVALID_ID  | ID is not a valid UUID format       |
| 404    | NOT_FOUND   | No book exists with the given ID    |

---

### POST /api/books

Create a new book.

**Request Body** (`application/json`):

| Field           | Type    | Required | Constraints                            |
|-----------------|---------|----------|----------------------------------------|
| title           | String  | Yes      | 1–200 characters                       |
| author          | String  | Yes      | 1–150 characters                       |
| publicationYear | Integer | No       | 1000 to current year + 1               |
| genre           | String  | No       | 1–100 characters                       |
| description     | String  | No       | Max 2,000 characters                   |

**Success Response**: `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "genre": "Fiction",
    "description": "A novel about the American dream...",
    "createdAt": "2026-09-23T10:00:00.000Z",
    "updatedAt": "2026-09-23T10:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Error Code        | When                              |
|--------|-------------------|-----------------------------------|
| 400    | VALIDATION_ERROR  | Missing required fields or invalid values |

---

### PUT /api/books/:id

Update an existing book. Only provided fields are updated; omitted fields remain unchanged.

**Path Parameters**:

| Parameter | Type   | Description           |
|-----------|--------|-----------------------|
| id        | String | UUID of the book      |

**Request Body** (`application/json`):

| Field           | Type    | Required | Constraints                            |
|-----------------|---------|----------|----------------------------------------|
| title           | String  | No       | 1–200 characters if provided           |
| author          | String  | No       | 1–150 characters if provided           |
| publicationYear | Integer | No       | 1000 to current year + 1 if provided   |
| genre           | String  | No       | 1–100 characters if provided           |
| description     | String  | No       | Max 2,000 characters if provided       |

At least one field must be provided.

**Success Response**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated Title",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "genre": "Fiction",
    "description": "Updated description...",
    "createdAt": "2026-09-23T10:00:00.000Z",
    "updatedAt": "2026-09-23T11:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Error Code        | When                                     |
|--------|-------------------|------------------------------------------|
| 400    | INVALID_ID        | ID is not a valid UUID format            |
| 400    | VALIDATION_ERROR  | No fields provided or invalid values     |
| 404    | NOT_FOUND         | No book exists with the given ID         |

---

### DELETE /api/books/:id

Delete a book permanently (hard delete).

**Path Parameters**:

| Parameter | Type   | Description           |
|-----------|--------|-----------------------|
| id        | String | UUID of the book      |

**Success Response**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "message": "Book deleted successfully"
  }
}
```

**Error Responses**:

| Status | Error Code  | When                                |
|--------|-------------|-------------------------------------|
| 400    | INVALID_ID  | ID is not a valid UUID format       |
| 404    | NOT_FOUND   | No book exists with the given ID    |
