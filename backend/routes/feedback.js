const express = require("express");
const router = express.Router();

// GET all feedback
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const [rows] = await db.query("SELECT * FROM Employee_Feedback");
  res.json(rows);
});

// POST feedback
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { student_id, employee_id, rating, comment, date } = req.body;
  await db.query(
    "INSERT INTO Employee_Feedback (student_id, employee_id, rating, comment, date) VALUES (?,?,?,?,?)",
    [student_id, employee_id, rating, comment, date]
  );
  res.json({ message: "Feedback added" });
});

module.exports = router;
