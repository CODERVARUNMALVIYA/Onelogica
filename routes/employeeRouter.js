const express = require("express");
const router = express.Router();
const {
  homepage,
  registerEmployee,
  loginEmployee,
  getEmployeeProfile,
  updateProfile,
} = require("../controllers/employerController");
const { isAuthenticated } = require("../middlewares/auth"); // Ensure this middleware is created

// Employee routes
router.get("/home", homepage);
router.post("/register", registerEmployee); // Route for registering a new employee
router.post("/login", loginEmployee); // Route for logging in an employee
router.get("/profile", isAuthenticated, getEmployeeProfile); // Middleware added to protect the profile route
router.put("/profile", isAuthenticated, updateProfile); // Middleware added to protect the profile update route

module.exports = router;
