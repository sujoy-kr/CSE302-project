const express = require("express");
const router = express.Router();
const { hash } = require("../utils/bcrypt");

// GET all students
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const [rows] = await db.query(
    "SELECT student_id, first_name, last_name, dept_name FROM Students"
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { first_name, last_name, dept_name, password } = req.body;
  const password_hash = await hash(password);
  const [result] = await db.query(
    "INSERT INTO Students (first_name, last_name, dept_name, password_hash) VALUES (?,?,?,?)",
    [first_name, last_name, dept_name, password_hash]
  );
  res.json({ student_id: result.insertId });
});

// PUT update student
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { first_name, last_name, dept_name } = req.body;
  await db.query(
    "UPDATE Students SET first_name=?, last_name=?, dept_name=? WHERE student_id=?",
    [first_name, last_name, dept_name, req.params.id]
  );
  res.json({ message: "Student updated" });
});

// DELETE student
router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  await db.query("DELETE FROM Students WHERE student_id=?", [req.params.id]);
  res.json({ message: "Student deleted" });
});

module.exports = router;
