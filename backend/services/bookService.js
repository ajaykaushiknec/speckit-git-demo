const { v4: uuidv4 } = require("uuid");

const books = new Map();

function getAll({ author, genre, yearFrom, yearTo } = {}, { page = 1, limit = 20 } = {}) {
  let results = Array.from(books.values());

  if (author) {
    const lower = author.toLowerCase();
    results = results.filter((b) => b.author.toLowerCase().includes(lower));
  }
  if (genre) {
    const lower = genre.toLowerCase();
    results = results.filter((b) => b.genre && b.genre.toLowerCase() === lower);
  }
  if (yearFrom != null) {
    results = results.filter((b) => b.publicationYear != null && b.publicationYear >= yearFrom);
  }
  if (yearTo != null) {
    results = results.filter((b) => b.publicationYear != null && b.publicationYear <= yearTo);
  }

  const totalItems = results.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return {
    data: paged,
    pagination: { totalItems, totalPages, currentPage: page, pageSize: limit },
  };
}

function getById(id) {
  return books.get(id) || null;
}

function create({ title, author, publicationYear, genre, description }) {
  const now = new Date().toISOString();
  const book = {
    id: uuidv4(),
    title: title.trim(),
    author: author.trim(),
    publicationYear: publicationYear ?? null,
    genre: genre ? genre.trim() : null,
    description: description ? description.trim() : null,
    createdAt: now,
    updatedAt: now,
  };
  books.set(book.id, book);
  return book;
}

function update(id, updates) {
  const book = books.get(id);
  if (!book) return null;

  if (updates.title !== undefined) book.title = updates.title.trim();
  if (updates.author !== undefined) book.author = updates.author.trim();
  if (updates.publicationYear !== undefined) book.publicationYear = updates.publicationYear;
  if (updates.genre !== undefined) book.genre = updates.genre ? updates.genre.trim() : null;
  if (updates.description !== undefined) book.description = updates.description ? updates.description.trim() : null;
  book.updatedAt = new Date().toISOString();

  return book;
}

function remove(id) {
  if (!books.has(id)) return false;
  books.delete(id);
  return true;
}

function clear() {
  books.clear();
}

module.exports = { getAll, getById, create, update, remove, clear };
