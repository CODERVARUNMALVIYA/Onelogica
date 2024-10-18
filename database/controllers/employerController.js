// controllers/employerController.js
const Employee = require("../models/employeeModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/ErrorHandler");

// Register an Employee
exports.homepage = catchAsyncErrors(async(req, res, next) =>{
  res.json({message: "Homepage"})
})

exports.registerEmployee = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, jobDetails } = req.body;

  // Validate required fields
  if (!name || !email || !password || !jobDetails?.position || !jobDetails?.salary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const employee = await Employee.create({
      name,
      email,
      password,
      jobDetails,
    });

    // Send JWT token to the client
    sendToken(employee, 201, res);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Login an Employee
exports.loginEmployee = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Find employee by email and include password for verification
  const employee = await Employee.findOne({ email }).select("+password");
  if (!employee || !(await employee.comparePassword(password))) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Send JWT token to the client
  sendToken(employee, 200, res);
});

// Get Employee Profile
exports.getEmployeeProfile = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.user.id); // Fetch employee by the authenticated user's ID

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  res.status(200).json({ success: true, employee }); // Return employee data
});

// Update Employee Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // Update the employee data with new information
  const updatedEmployee = await Employee.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });

  if (!updatedEmployee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  res.status(200).json({ success: true, updatedEmployee });
});
