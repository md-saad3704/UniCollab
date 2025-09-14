const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// ✅ REGISTER Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const [existing] = await req.db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user into DB
    const [result] = await req.db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    // Generate JWT token for auto-login
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ LOGIN Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await req.db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
