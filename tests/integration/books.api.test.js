const { describe, it, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../../backend/server");
const bookService = require("../../backend/services/bookService");

let server;
let baseUrl;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = { method, hostname: url.hostname, port: url.port, path: url.pathname + url.search };
    const headers = {};
    let payload;
    if (body) {
      payload = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }
    options.headers = headers;

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

describe("Books API integration", () => {
  before((_, done) => {
    server = app.listen(0, () => {
      const addr = server.address();
      baseUrl = `http://127.0.0.1:${addr.port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  beforeEach(() => {
    bookService.clear();
  });

  describe("POST /api/books", () => {
    it("creates a book with valid data", async () => {
      const res = await request("POST", "/api/books", { title: "Test", author: "Author" });
      assert.equal(res.status, 201);
      assert.equal(res.body.status, "success");
      assert.ok(res.body.data.id);
      assert.equal(res.body.data.title, "Test");
    });

    it("rejects missing required fields", async () => {
      const res = await request("POST", "/api/books", { genre: "Fiction" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "VALIDATION_ERROR");
      assert.ok(res.body.details.length >= 2);
    });

    it("rejects empty title", async () => {
      const res = await request("POST", "/api/books", { title: "  ", author: "A" });
      assert.equal(res.status, 400);
    });
  });

  describe("GET /api/books", () => {
    it("returns empty list when no books exist", async () => {
      const res = await request("GET", "/api/books");
      assert.equal(res.status, 200);
      assert.equal(res.body.data.length, 0);
      assert.equal(res.body.pagination.totalItems, 0);
    });

    it("returns books with pagination", async () => {
      await request("POST", "/api/books", { title: "A", author: "X" });
      await request("POST", "/api/books", { title: "B", author: "Y" });
      const res = await request("GET", "/api/books");
      assert.equal(res.body.data.length, 2);
      assert.equal(res.body.pagination.totalItems, 2);
    });

    it("filters by author", async () => {
      await request("POST", "/api/books", { title: "A", author: "George Orwell" });
      await request("POST", "/api/books", { title: "B", author: "Jane Austen" });
      const res = await request("GET", "/api/books?author=orwell");
      assert.equal(res.body.data.length, 1);
    });

    it("paginates results", async () => {
      for (let i = 0; i < 5; i++) {
        await request("POST", "/api/books", { title: `Book ${i}`, author: "A" });
      }
      const res = await request("GET", "/api/books?page=1&limit=2");
      assert.equal(res.body.data.length, 2);
      assert.equal(res.body.pagination.totalPages, 3);
    });

    it("rejects invalid page parameter", async () => {
      const res = await request("GET", "/api/books?page=abc");
      assert.equal(res.status, 400);
    });
  });

  describe("GET /api/books/:id", () => {
    it("returns a book by id", async () => {
      const created = await request("POST", "/api/books", { title: "Find Me", author: "A" });
      const res = await request("GET", `/api/books/${created.body.data.id}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.title, "Find Me");
    });

    it("returns 404 for non-existent id", async () => {
      const res = await request("GET", "/api/books/00000000-0000-0000-0000-000000000000");
      assert.equal(res.status, 404);
      assert.equal(res.body.error, "NOT_FOUND");
    });

    it("returns 400 for invalid id format", async () => {
      const res = await request("GET", "/api/books/not-a-uuid");
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "INVALID_ID");
    });
  });

  describe("PUT /api/books/:id", () => {
    it("updates a book", async () => {
      const created = await request("POST", "/api/books", { title: "Old", author: "A" });
      const res = await request("PUT", `/api/books/${created.body.data.id}`, { title: "New" });
      assert.equal(res.status, 200);
      assert.equal(res.body.data.title, "New");
      assert.equal(res.body.data.author, "A");
    });

    it("returns 404 for non-existent book", async () => {
      const res = await request("PUT", "/api/books/00000000-0000-0000-0000-000000000000", { title: "X" });
      assert.equal(res.status, 404);
    });

    it("rejects update with no fields", async () => {
      const created = await request("POST", "/api/books", { title: "T", author: "A" });
      const res = await request("PUT", `/api/books/${created.body.data.id}`, {});
      assert.equal(res.status, 400);
    });
  });

  describe("DELETE /api/books/:id", () => {
    it("deletes a book", async () => {
      const created = await request("POST", "/api/books", { title: "Delete Me", author: "A" });
      const res = await request("DELETE", `/api/books/${created.body.data.id}`);
      assert.equal(res.status, 200);

      const check = await request("GET", `/api/books/${created.body.data.id}`);
      assert.equal(check.status, 404);
    });

    it("returns 404 for non-existent book", async () => {
      const res = await request("DELETE", "/api/books/00000000-0000-0000-0000-000000000000");
      assert.equal(res.status, 404);
    });
  });
});
