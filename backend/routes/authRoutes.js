const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authmiddleware");
const authRateLimit = require("../middleware/authRateLimit");
const transporter = require("../config/mailer");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;

router.post("/register", authRateLimit.register, async (req, res) => {
  const { username, email, password } = req.body;

  if (
    typeof username !== "string" ||
    !username.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query(
      "SELECT id FROM register WHERE email = ?",
      [normalizedEmail],
    );
    if (rows.length > 0) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO register(username, email, password) VALUES(?, ?, ?)",
      [username.trim(), normalizedEmail, hashPassword],
    );
    return res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email is already registered" });
    }

    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", authRateLimit.login, async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM register WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      expiresIn: "3h",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email FROM register WHERE id = ?",
      [req.user.userId],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post(
  "/forgot-password",
  authRateLimit.forgotPassword,
  async (req, res) => {
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    try {
      const [rows] = await pool.query(
        "SELECT id, email FROM register WHERE email = ?",
        [email.trim().toLowerCase()],
      );
      if (rows.length === 0) {
        return res.status(200).json({
          message:
            "If an account exists for this email, a reset link will be sent.",
        });
      }

      const token = jwt.sign(
        { userId: rows[0].id },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: "30m" },
      );
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rows[0].id}/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: rows[0].email,
        subject: "Password Reset Request",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #4F46E5; text-align: center;">Password Reset</h2>
            <p>Hello,</p>
            <p>You have requested to reset your account password. Please click the button below to set your new password:</p>
            <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email. This link will expire in 30 minutes.</p>
       </div>`,
      });

      return res.status(200).json({
        message: "If an account exists for this email, a reset link will be sent.",
      });
    } catch (error) {
      console.error("Password-reset email error:", error);
      return res.status(500).json({
        message: "Unable to process the password-reset request",
      });
    }
  },
);

router.post(
  "/reset-password/:userId/:token",
  authRateLimit.resetPassword,
  async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    if (typeof password !== "string" || !passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    if (decoded.userId !== Number(userId)) {
      return res.status(400).json({
        message: "Invalid reset link",
      });
    }

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        "UPDATE register SET password = ? WHERE id = ?",
        [hashPassword, userId],
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Invalid reset link" });
      }

      return res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      return res.status(500).json({
        message: "Unable to reset password",
      });
    }
  },
);

module.exports = router;
