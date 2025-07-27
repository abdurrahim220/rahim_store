import status from "http-status";

class NotFoundError extends Error {
  constructor(path) {
    super(`Resource not found at ${path}`);
    this.name = "NotFoundError";
  }
}

const notFound = (req, res) => {
  const error = new NotFoundError(req.originalUrl);
  res.status(status.NOT_FOUND).json({
    status: "error",
    error: error.message,
  });
};

export default notFound;