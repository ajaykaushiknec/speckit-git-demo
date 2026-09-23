const { Router } = require("express");
const bookService = require("../services/bookService");
const { validateCreate, validateUpdate, validateId, validatePagination } = require("../middleware/validate");

const router = Router();

router.get("/", validatePagination, (req, res) => {
  const filters = {
    author: req.query.author,
    genre: req.query.genre,
    yearFrom: req.query.yearFrom ? Number(req.query.yearFrom) : undefined,
    yearTo: req.query.yearTo ? Number(req.query.yearTo) : undefined,
  };
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const result = bookService.getAll(filters, { page, limit });
  res.json({ status: "success", data: result.data, pagination: result.pagination });
});

router.get("/:id", validateId, (req, res) => {
  const book = bookService.getById(req.params.id);
  if (!book) {
    return res.status(404).json({
      status: "error",
      error: "NOT_FOUND",
      message: `Book with id '${req.params.id}' not found`,
    });
  }
  res.json({ status: "success", data: book });
});

router.post("/", validateCreate, (req, res) => {
  const book = bookService.create(req.body);
  res.status(201).json({ status: "success", data: book });
});

router.put("/:id", validateId, validateUpdate, (req, res) => {
  const book = bookService.update(req.params.id, req.body);
  if (!book) {
    return res.status(404).json({
      status: "error",
      error: "NOT_FOUND",
      message: `Book with id '${req.params.id}' not found`,
    });
  }
  res.json({ status: "success", data: book });
});

router.delete("/:id", validateId, (req, res) => {
  const deleted = bookService.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      status: "error",
      error: "NOT_FOUND",
      message: `Book with id '${req.params.id}' not found`,
    });
  }
  res.json({ status: "success", data: { message: "Book deleted successfully" } });
});

module.exports = router;
