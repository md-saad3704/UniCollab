const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ✅ Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const db = req.db;

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }

  const [existingUser] = await req.db.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existingUser.length > 0) {
    return res.status(400).json({ error: "Email already registered" });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await req.db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ✅ Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// ✅ Update user profile
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const [user] = await req.db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (!user.length) return res.status(404).json({ error: "User not found" });

    const [existing] = await req.db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, req.user.id]
    );
    if (existing.length) {
      return res.status(400).json({ error: "Email already in use" });
    }

    await req.db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      req.user.id,
    ]);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("PUT /update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Get authenticated user details
exports.getMe = async (req, res) => {
  try {
    console.log("📦 Token Decoded:", req.user);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const [rows] = await req.db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    console.error("❌ Error in getMe():", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Missing password fields" });

  try {
    const [userRows] = await req.db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const user = userRows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await req.db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};
