const express = require('express')
const router = express.Router()

// GET all orders
router.get('/', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query('SELECT * FROM Orders')
    res.json(rows)
})

// POST create order
router.post('/', async (req, res) => {
    const db = req.app.locals.db
    const { student_id, food_item_id, quantity, order_date, status } = req.body
    const [result] = await db.query(
        'INSERT INTO Orders (student_id, food_item_id, quantity, order_date, status) VALUES (?,?,?,?,?)',
        [student_id, food_item_id, quantity, order_date, status]
    )
    res.json({ order_id: result.insertId })
})

// POST assign delivery employee
router.post('/assign-delivery', async (req, res) => {
    const db = req.app.locals.db
    const { employee_id, order_id } = req.body
    await db.query(
        'INSERT INTO Order_Delivery (employee_id, order_id) VALUES (?,?)',
        [employee_id, order_id]
    )
    res.json({ message: 'Employee assigned to delivery' })
})

module.exports = router
