const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const bookService = require("../../backend/services/bookService");

describe("bookService", () => {
  beforeEach(() => {
    bookService.clear();
  });

  describe("create", () => {
    it("creates a book with required fields and assigns id/timestamps", () => {
      const book = bookService.create({ title: "Test Book", author: "Author A" });
      assert.ok(book.id);
      assert.equal(book.title, "Test Book");
      assert.equal(book.author, "Author A");
      assert.equal(book.publicationYear, null);
      assert.equal(book.genre, null);
      assert.equal(book.description, null);
      assert.ok(book.createdAt);
      assert.ok(book.updatedAt);
    });

    it("creates a book with all fields", () => {
      const book = bookService.create({
        title: "Full Book",
        author: "Author B",
        publicationYear: 2020,
        genre: "Fiction",
        description: "A test description",
      });
      assert.equal(book.publicationYear, 2020);
      assert.equal(book.genre, "Fiction");
      assert.equal(book.description, "A test description");
    });

    it("trims whitespace from string fields", () => {
      const book = bookService.create({ title: "  Spaced  ", author: "  Author  " });
      assert.equal(book.title, "Spaced");
      assert.equal(book.author, "Author");
    });

    it("assigns unique IDs to different books", () => {
      const a = bookService.create({ title: "A", author: "X" });
      const b = bookService.create({ title: "B", author: "Y" });
      assert.notEqual(a.id, b.id);
    });
  });

  describe("getById", () => {
    it("returns the book when it exists", () => {
      const created = bookService.create({ title: "Find Me", author: "Author" });
      const found = bookService.getById(created.id);
      assert.deepEqual(found, created);
    });

    it("returns null for a non-existent id", () => {
      assert.equal(bookService.getById("00000000-0000-0000-0000-000000000000"), null);
    });
  });

  describe("getAll", () => {
    it("returns empty array when no books exist", () => {
      const result = bookService.getAll();
      assert.equal(result.data.length, 0);
      assert.equal(result.pagination.totalItems, 0);
    });

    it("returns all books with pagination metadata", () => {
      bookService.create({ title: "A", author: "X" });
      bookService.create({ title: "B", author: "Y" });
      const result = bookService.getAll();
      assert.equal(result.data.length, 2);
      assert.equal(result.pagination.totalItems, 2);
      assert.equal(result.pagination.currentPage, 1);
      assert.equal(result.pagination.pageSize, 20);
    });

    it("paginates correctly", () => {
      for (let i = 0; i < 5; i++) {
        bookService.create({ title: `Book ${i}`, author: "Author" });
      }
      const page1 = bookService.getAll({}, { page: 1, limit: 2 });
      assert.equal(page1.data.length, 2);
      assert.equal(page1.pagination.totalPages, 3);

      const page3 = bookService.getAll({}, { page: 3, limit: 2 });
      assert.equal(page3.data.length, 1);
    });

    it("filters by author (case-insensitive partial match)", () => {
      bookService.create({ title: "A", author: "George Orwell" });
      bookService.create({ title: "B", author: "Jane Austen" });
      const result = bookService.getAll({ author: "orwell" });
      assert.equal(result.data.length, 1);
      assert.equal(result.data[0].author, "George Orwell");
    });

    it("filters by genre (case-insensitive exact match)", () => {
      bookService.create({ title: "A", author: "X", genre: "Fiction" });
      bookService.create({ title: "B", author: "Y", genre: "Science" });
      const result = bookService.getAll({ genre: "fiction" });
      assert.equal(result.data.length, 1);
    });

    it("filters by year range", () => {
      bookService.create({ title: "Old", author: "X", publicationYear: 1900 });
      bookService.create({ title: "Mid", author: "Y", publicationYear: 1950 });
      bookService.create({ title: "New", author: "Z", publicationYear: 2020 });
      const result = bookService.getAll({ yearFrom: 1940, yearTo: 1960 });
      assert.equal(result.data.length, 1);
      assert.equal(result.data[0].title, "Mid");
    });
  });

  describe("update", () => {
    it("updates specified fields and refreshes updatedAt", () => {
      const book = bookService.create({ title: "Original", author: "Author" });
      const originalUpdatedAt = book.updatedAt;

      // Small delay so timestamp differs
      const updated = bookService.update(book.id, { title: "Changed" });
      assert.equal(updated.title, "Changed");
      assert.equal(updated.author, "Author");
      assert.ok(updated.updatedAt >= originalUpdatedAt);
    });

    it("returns null for non-existent book", () => {
      assert.equal(bookService.update("00000000-0000-0000-0000-000000000000", { title: "X" }), null);
    });

    it("leaves unmentioned fields unchanged", () => {
      const book = bookService.create({ title: "T", author: "A", genre: "Fiction" });
      bookService.update(book.id, { title: "New T" });
      const fetched = bookService.getById(book.id);
      assert.equal(fetched.genre, "Fiction");
    });
  });

  describe("remove", () => {
    it("deletes an existing book and returns true", () => {
      const book = bookService.create({ title: "Delete Me", author: "Author" });
      assert.equal(bookService.remove(book.id), true);
      assert.equal(bookService.getById(book.id), null);
    });

    it("returns false for non-existent book", () => {
      assert.equal(bookService.remove("00000000-0000-0000-0000-000000000000"), false);
    });
  });
});
