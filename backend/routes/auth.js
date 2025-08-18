const express = require("express");
const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const db = req.app.locals.db;
  const { userType, ID, password_hash } = req.body;

  let table = "";
  let idField = "";
  if (userType === "student") {
    table = "Students";
    idField = "student_id";
  } else if (userType === "employee") {
    table = "Employee";
    idField = "employee_id";
  } else if (userType === "supplier") {
    table = "Suppliers";
    idField = "supplier_id";
  } else return res.status(400).json({ exists: false });

  try {
    const [results] = await db.query(
      `SELECT * FROM ${table} WHERE ${idField} = ? AND password_hash = ?`,
      [ID, password_hash]
    );
    if (results.length === 0) return res.json({ exists: false });

    res.json({ exists: true });
  } catch (err) {
    res.status(500).json({ exists: false, error: err });
  }
});

module.exports = router;
