import status from "http-status";
import AppError from "../error/appError.js";

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  return new AppError("Validation failed", status.BAD_REQUEST, errors);
};
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, status.BAD_REQUEST);
};
// Handle duplicate field errors
const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, status.BAD_REQUEST, [
    { field, message: `${field} must be unique` },
  ]);
};

// Global error handler middleware
const errorValidator = (err, req, res, next) => {
  err.statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  // Log detailed error in development
  if (process.env.NODE_ENV === "development") {
    console.error("💥 ERROR:", err);
    sendErrorDev(err, req, res);
  } else {
    // Operational errors we trust: send to client
    let error = { ...err };
    error.message = err.message;

    // Mongoose validation error
    if (err.name === "ValidationError") error = handleValidationError(error);
    // Duplicate field error
    if (err.code === 11000) error = handleDuplicateFields(error);
    // Cast error
    if (err.name === 'CastError') error = handleCastError(error);

    sendErrorProd(error, req, res);
  }
};

// Development error response
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production error response
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || undefined,
    });
  }
  // Unknown error - don't leak details
  else {
    console.error("💥 ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export default errorValidator;