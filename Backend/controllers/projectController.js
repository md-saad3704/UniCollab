const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const tagsString = tags.join(","); // ✅ CSV format

    await req.db.query(
      `INSERT INTO projects (user_id, title, description, tags, category, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [req.user.id, title, description, tagsString, category]
    );

    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// ✅ Get all projects with author details
exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      `SELECT p.*, u.name AS author
       FROM projects p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );

    const projects = rows.map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      tags: proj.tags ? proj.tags.split(",").map((tag) => tag.trim()) : [],
      category: proj.category,
      author: proj.author,
      created_at: proj.created_at,
    }));

    res.json({ projects });
  } catch (err) {
    console.error("Fetch projects failed:", err);
    res.status(500).json({ error: "Could not fetch projects" });
  }
};

// ✅ Get projects created by logged-in user
exports.getMyProjects = async (req, res) => {
  try {
    const [projects] = await req.db.execute(
      "SELECT * FROM projects WHERE user_id = ?",
      [req.user.id]
    );

    const formattedProjects = projects.map((project) => ({
      ...project,
      tags: project.tags ? project.tags.split(",").map((tag) => tag.trim()) : [],
    }));

    res.json({ projects: formattedProjects });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// ✅ Update a project by ID
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags, category } = req.body;

  try {
    const tagsString = tags.join(",");

    await req.db.execute(
      "UPDATE projects SET title = ?, description = ?, tags = ?, category = ? WHERE id = ? AND user_id = ?",
      [title, description, tagsString, category, id, req.user.id]
    );

    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ Delete a project by ID
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.execute("DELETE FROM projects WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Deletion failed" });
  }
};

// ✅ Get full details of a single project by ID
exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const [rows] = await req.db.query(
      `SELECT p.*, u.name AS author
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [projectId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = rows[0];
    const formattedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      author: project.author,
      created_at: project.created_at,
      tags: project.tags ? project.tags.split(",").map((tag) => tag.trim()) : [],
    };

    res.json({ project: formattedProject });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

// ✅ Submit join request to a project
exports.requestToJoinProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    const [existing] = await req.db.query(
      "SELECT * FROM project_requests WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "You already requested to join this project." });
    }

    await req.db.query(
      "INSERT INTO project_requests (project_id, user_id, status, requested_at) VALUES (?, ?, 'pending', NOW())",
      [projectId, userId]
    );

    res.status(201).json({ message: "Join request submitted." });
  } catch (err) {
    console.error("Join request failed:", err);
    res.status(500).json({ error: "Failed to request to join project." });
  }
};

// ✅ Alternate join request table (if used)
exports.requestToJoin = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  try {
    const [existing] = await req.db.query(
      "SELECT * FROM join_requests WHERE user_id = ? AND project_id = ?",
      [userId, projectId]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Already requested to join this project." });
    }

    await req.db.query(
      "INSERT INTO join_requests (user_id, project_id) VALUES (?, ?)",
      [userId, projectId]
    );

    res.status(201).json({ message: "Join request sent successfully." });
  } catch (err) {
    console.error("Join request error:", err);
    res.status(500).json({ error: "Failed to send join request." });
  }
};
