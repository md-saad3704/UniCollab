const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getJoinRequests,
  updateJoinRequestStatus
} = require("../controllers/joinRequestController");

router.get("/", authenticate, getJoinRequests); // Owner views all requests
router.put("/:id", authenticate, updateJoinRequestStatus); // Accept/Reject

module.exports = router;
