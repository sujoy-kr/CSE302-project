const express = require("express");
const router = express.Router();

// GET all employees
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const [rows] = await db.query("SELECT * FROM Employee");
  res.json(rows);
});

// POST add employee
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const {
    first_name,
    last_name,
    role,
    salary,
    phone,
    hire_date,
    password_hash,
  } = req.body;
  const [result] = await db.query(
    "INSERT INTO Employee (first_name, last_name, role, salary, phone, hire_date, password_hash) VALUES (?,?,?,?,?,?,?)",
    [first_name, last_name, role, salary, phone, hire_date, password_hash]
  );
  res.json({ employee_id: result.insertId });
});

module.exports = router;
