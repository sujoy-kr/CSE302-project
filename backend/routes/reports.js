const express = require('express')
const router = express.Router()

// 1. Top 10 Most Ordered Foods
router.get('/top-food', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT f.food_name, SUM(o.quantity) AS total_ordered
      FROM Orders o
      JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY f.food_name
      ORDER BY total_ordered DESC
      LIMIT 10
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 2. Most Popular Departments
router.get('/popular-department', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT s.dept_name, COUNT(*) AS orders_count
      FROM Orders o
      JOIN Students s ON o.student_id = s.student_id
      GROUP BY s.dept_name
      ORDER BY orders_count DESC
      LIMIT 5
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 3. Category-wise Revenue
router.get('/category-revenue', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT f.category, SUM(f.price * o.quantity) AS revenue
      FROM Orders o
      JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY f.category
      ORDER BY revenue DESC
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 4. Employee with Most 5-Star Reviews
router.get('/top-employee-rating', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT e.first_name, e.last_name, COUNT(*) AS five_star_count
      FROM Employee_Feedback ef
      JOIN Employee e ON ef.employee_id = e.employee_id
      WHERE ef.rating = 5
      GROUP BY ef.employee_id
      ORDER BY five_star_count DESC
      LIMIT 1
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 5. Employee with Highest Avg Orders Per Day
router.get('/top-employee-orders', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT e.first_name, e.last_name, COUNT(o.order_id)/COUNT(DISTINCT DATE(o.order_date)) AS avg_orders_per_day
      FROM Orders o
      JOIN Employee e ON o.employee_id = e.employee_id
      GROUP BY o.employee_id
      ORDER BY avg_orders_per_day DESC
      LIMIT 1
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 6. Most Active Students (by order count)
router.get('/top-students', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT s.first_name, s.last_name, COUNT(*) AS orders_count
      FROM Orders o
      JOIN Students s ON o.student_id = s.student_id
      GROUP BY s.student_id
      ORDER BY orders_count DESC
      LIMIT 10
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 7. Suppliers by Total Quantity Supplied
router.get('/top-suppliers', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT s.supplier_name, SUM(fs.quantity) AS total_supplied
      FROM Food_Item_Supply fs
      JOIN Suppliers s ON fs.supplier_id = s.supplier_id
      GROUP BY s.supplier_id
      ORDER BY total_supplied DESC
      LIMIT 5
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 8. Daily Revenue (last 30 days)
router.get('/daily-revenue', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT o.order_date, SUM(f.price * o.quantity) AS daily_revenue
      FROM Orders o
      JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY o.order_date
      ORDER BY o.order_date DESC
      LIMIT 30
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 9. Average Rating per Employee
router.get('/employee-average-rating', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT e.first_name, e.last_name, AVG(ef.rating) AS avg_rating, COUNT(ef.feedback_id) AS feedback_count
      FROM Employee_Feedback ef
      JOIN Employee e ON ef.employee_id = e.employee_id
      GROUP BY e.employee_id
      ORDER BY avg_rating DESC, feedback_count DESC
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// 10. Top Food per Department
router.get('/top-food-per-department', async (req, res) => {
    const db = req.app.locals.db
    try {
        const [rows] = await db.query(`
      SELECT s.dept_name, f.food_name, COUNT(*) AS order_count
      FROM Orders o
      JOIN Students s ON o.student_id = s.student_id
      JOIN Food_Items f ON o.food_item_id = f.food_item_id
      GROUP BY s.dept_name, f.food_name
      ORDER BY s.dept_name, order_count DESC
    `)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
