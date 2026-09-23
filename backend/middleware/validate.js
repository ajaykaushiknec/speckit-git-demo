const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validationError(res, details) {
  return res.status(400).json({
    status: "error",
    error: "VALIDATION_ERROR",
    message: "Validation failed",
    details,
  });
}

function validateCreate(req, res, next) {
  const errors = [];
  const { title, author, publicationYear, genre, description } = req.body;

  if (!title || (typeof title === "string" && title.trim().length === 0)) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (typeof title !== "string" || title.trim().length > 200) {
    errors.push({ field: "title", message: "Title must be a string of 1-200 characters" });
  }

  if (!author || (typeof author === "string" && author.trim().length === 0)) {
    errors.push({ field: "author", message: "Author is required" });
  } else if (typeof author !== "string" || author.trim().length > 150) {
    errors.push({ field: "author", message: "Author must be a string of 1-150 characters" });
  }

  if (publicationYear !== undefined && publicationYear !== null) {
    const year = Number(publicationYear);
    if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      errors.push({ field: "publicationYear", message: `Publication year must be between 1000 and ${new Date().getFullYear() + 1}` });
    }
  }

  if (genre !== undefined && genre !== null) {
    if (typeof genre !== "string" || genre.trim().length === 0 || genre.trim().length > 100) {
      errors.push({ field: "genre", message: "Genre must be a string of 1-100 characters" });
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string" || description.length > 2000) {
      errors.push({ field: "description", message: "Description must be a string of up to 2000 characters" });
    }
  }

  if (errors.length > 0) return validationError(res, errors);
  next();
}

function validateUpdate(req, res, next) {
  const fields = ["title", "author", "publicationYear", "genre", "description"];
  const provided = fields.filter((f) => req.body[f] !== undefined);

  if (provided.length === 0) {
    return validationError(res, [{ field: "body", message: "At least one field must be provided" }]);
  }

  const errors = [];
  const { title, author, publicationYear, genre, description } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 200) {
      errors.push({ field: "title", message: "Title must be a non-empty string of up to 200 characters" });
    }
  }

  if (author !== undefined) {
    if (typeof author !== "string" || author.trim().length === 0 || author.trim().length > 150) {
      errors.push({ field: "author", message: "Author must be a non-empty string of up to 150 characters" });
    }
  }

  if (publicationYear !== undefined && publicationYear !== null) {
    const year = Number(publicationYear);
    if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      errors.push({ field: "publicationYear", message: `Publication year must be between 1000 and ${new Date().getFullYear() + 1}` });
    }
  }

  if (genre !== undefined && genre !== null) {
    if (typeof genre !== "string" || genre.trim().length === 0 || genre.trim().length > 100) {
      errors.push({ field: "genre", message: "Genre must be a string of 1-100 characters" });
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string" || description.length > 2000) {
      errors.push({ field: "description", message: "Description must be a string of up to 2000 characters" });
    }
  }

  if (errors.length > 0) return validationError(res, errors);
  next();
}

function validateId(req, res, next) {
  if (!UUID_RE.test(req.params.id)) {
    return res.status(400).json({
      status: "error",
      error: "INVALID_ID",
      message: "ID must be a valid UUID",
    });
  }
  next();
}

function validatePagination(req, res, next) {
  const errors = [];

  if (req.query.page !== undefined) {
    const page = Number(req.query.page);
    if (!Number.isInteger(page) || page < 1) {
      errors.push({ field: "page", message: "Page must be a positive integer" });
    }
  }

  if (req.query.limit !== undefined) {
    const limit = Number(req.query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      errors.push({ field: "limit", message: "Limit must be an integer between 1 and 100" });
    }
  }

  if (errors.length > 0) return validationError(res, errors);
  next();
}

module.exports = { validateCreate, validateUpdate, validateId, validatePagination };
