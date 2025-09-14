const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  register,
  loginUser,
  getMe,
  updateUser,
  getUserProfile,
  changePassword, // ✅ add this
  // forgotPassword,
  // resetPassword,
} = require("../controllers/userController");


// Public routes
router.post("/register", register);
router.post("/login", loginUser);

// Protected routes
router.get("/me", authenticate, getMe);        // ✅ returns { id, username, email }
router.put("/update", authenticate, updateUser); // ✅ correct name
router.put("/change-password", authenticate, changePassword);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

module.exports = router;

