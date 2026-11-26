const { rateLimit } = require("express-rate-limit");

const createLimiter = (limit, windowMs) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  });

module.exports = {
  register: createLimiter(5, 60 * 60 * 1000),
  login: createLimiter(10, 15 * 60 * 1000),
  forgotPassword: createLimiter(5, 15 * 60 * 1000),
  resetPassword: createLimiter(10, 15 * 60 * 1000),
};
