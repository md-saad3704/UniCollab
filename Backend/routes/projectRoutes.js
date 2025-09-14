const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  createProject,
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../controllers/projectController");

const { requestToJoinProject } = require("../controllers/projectController");
const { requestToJoin } = require("../controllers/projectController");

// Protected routes
router.post("/", authenticate, createProject);
router.get("/", getAllProjects); // ✅ uses getAllProjects from controller
router.get("/my", authenticate, getMyProjects);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);
router.get("/:id", getProjectById);
router.post("/:id/request", authenticate, requestToJoinProject);
router.post("/:id/join", authenticate, requestToJoin);
module.exports = router;
