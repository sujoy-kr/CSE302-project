const express = require('express')
const router = express.Router()

// Top food ordered
router.get('/top-food', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query(`
        SELECT f.food_name, SUM(o.quantity) AS total_ordered
        FROM Orders o
        JOIN Food_Items f ON o.food_item_id = f.food_item_id
        GROUP BY f.food_name
        ORDER BY total_ordered DESC
        LIMIT 10
    `)
    res.json(rows)
})

// Most popular department
router.get('/popular-department', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query(`
        SELECT s.dept_name, COUNT(*) AS orders_count
        FROM Orders o
        JOIN Students s ON o.student_id = s.student_id
        GROUP BY s.dept_name
        ORDER BY orders_count DESC
        LIMIT 5
    `)
    res.json(rows)
})

// Food category-wise revenue
router.get('/category-revenue', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query(`
        SELECT f.category, SUM(f.price * o.quantity) AS revenue
        FROM Orders o
        JOIN Food_Items f ON o.food_item_id = f.food_item_id
        GROUP BY f.category
    `)
    res.json(rows)
})

// Employee with most 5-star reviews
router.get('/top-employee-rating', async (req, res) => {
    const db = req.app.locals.db
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
})

// Employee with highest orders processed per day
router.get('/top-employee-orders', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query(`
        SELECT e.first_name, e.last_name, COUNT(*)/COUNT(DISTINCT DATE(o.order_date)) AS avg_orders_per_day
        FROM Order_Delivery od
        JOIN Employee e ON od.employee_id = e.employee_id
        JOIN Orders o ON od.order_id = o.order_id
        GROUP BY od.employee_id
        ORDER BY avg_orders_per_day DESC
        LIMIT 1
    `)
    res.json(rows)
})

module.exports = router
