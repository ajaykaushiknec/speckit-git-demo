# Data Model: Books API

**Feature**: Books API | **Date**: 2026-09-23

## Entities

### Book

The central entity representing a single book in the catalog.

| Field           | Type     | Required | Constraints                                      |
|-----------------|----------|----------|--------------------------------------------------|
| id              | String   | Auto     | UUID v4, assigned on creation, immutable          |
| title           | String   | Yes      | 1–200 characters, non-empty after trimming        |
| author          | String   | Yes      | 1–150 characters, non-empty after trimming        |
| publicationYear | Integer  | No       | 4 digits, between 1000 and current year + 1       |
| genre           | String   | No       | 1–100 characters if provided                      |
| description     | String   | No       | Max 2,000 characters if provided                  |
| createdAt       | DateTime | Auto     | ISO 8601, assigned on creation, immutable         |
| updatedAt       | DateTime | Auto     | ISO 8601, updated on every modification           |

### Validation Rules

- **title**: Required on create. Must be a non-empty string after trimming whitespace. Maximum 200 characters.
- **author**: Required on create. Must be a non-empty string after trimming whitespace. Maximum 150 characters.
- **publicationYear**: Optional. If provided, must be an integer between 1000 and the current year + 1 (to allow forthcoming publications).
- **genre**: Optional. If provided, must be a non-empty string, max 100 characters.
- **description**: Optional. If provided, max 2,000 characters.
- **On update**: At least one field must be provided. Same validation rules apply to any field that is included. Fields not included in the update request remain unchanged.

### Relationships

None. Book is a standalone entity with no foreign key relationships in this feature scope.

### State Transitions

Books have no lifecycle states. They exist from creation until deletion (hard delete). The `createdAt` and `updatedAt` timestamps track temporal state.

## Pagination Model

| Parameter | Type    | Default | Constraints            |
|-----------|---------|---------|------------------------|
| page      | Integer | 1       | Minimum 1              |
| limit     | Integer | 20      | Minimum 1, maximum 100 |

### Pagination Response Metadata

| Field       | Type    | Description                        |
|-------------|---------|-------------------------------------|
| totalItems  | Integer | Total number of books matching filters |
| totalPages  | Integer | Ceiling of totalItems / limit       |
| currentPage | Integer | The requested page number           |
| pageSize    | Integer | The effective limit for this request |

## Filter Parameters

| Parameter | Type    | Behavior                                              |
|-----------|---------|-------------------------------------------------------|
| author    | String  | Case-insensitive partial match against author field    |
| genre     | String  | Case-insensitive exact match against genre field       |
| yearFrom  | Integer | Books with publicationYear >= yearFrom                |
| yearTo    | Integer | Books with publicationYear <= yearTo                  |

Filters are combined with AND logic. If no filters are provided, all books are returned.
