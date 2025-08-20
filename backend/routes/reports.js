const express = require("express");
const router = express.Router();

router.get("/top-food", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT f.food_name, SUM(o.quantity) AS total_ordered
      FROM Orders o
      INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY f.food_name
      ORDER BY total_ordered DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/popular-department", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT s.dept_name, COUNT(*) AS orders_count
      FROM Orders o
      INNER JOIN Students s ON o.student_id = s.student_id
      GROUP BY s.dept_name
      ORDER BY orders_count DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/category-revenue", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT f.category, SUM(f.price * o.quantity) AS revenue
      FROM Orders o
      INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY f.category
      ORDER BY revenue DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/top-students", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT s.first_name, s.last_name, COUNT(*) AS orders_count
      FROM Orders o
      INNER JOIN Students s ON o.student_id = s.student_id
      GROUP BY s.student_id
      ORDER BY orders_count DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/top-suppliers", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT s.supplier_name, SUM(fs.quantity) AS total_supplied
      FROM Food_Item_Supply fs
      INNER JOIN Suppliers s ON fs.supplier_id = s.supplier_id
      GROUP BY s.supplier_id
      ORDER BY total_supplied DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/daily-revenue", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT o.order_date, SUM(f.price * o.quantity) AS daily_revenue
      FROM Orders o
      INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY o.order_date
      ORDER BY o.order_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/employee-average-rating", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT e.first_name, e.last_name, AVG(ef.rating) AS avg_rating, COUNT(ef.feedback_id) AS feedback_count
      FROM Employee_Feedback ef
      INNER JOIN Employee e ON ef.employee_id = e.employee_id
      GROUP BY e.employee_id
      ORDER BY avg_rating DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/top-food-per-department", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(`
      SELECT s.dept_name, f.food_name, COUNT(*) AS order_count
      FROM Orders o
      INNER JOIN Students s ON o.student_id = s.student_id
      INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY s.dept_name, f.food_name
      ORDER BY s.dept_name, order_count DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
