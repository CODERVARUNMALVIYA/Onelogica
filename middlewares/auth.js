// middlewares/isAuthenticated.js
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncError");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; // Ensure you're retrieving the token from cookies
  if (!token) {
    return next(new ErrorHandler("Please Login to Access the Resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: decoded.id }; // Set req.user.id for later use
  next();
});
