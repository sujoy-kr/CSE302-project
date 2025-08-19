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
    const { student_id, food_item_id, quantity } = req.body

    try {
        const [result] = await db.query(
            `INSERT INTO Orders (student_id, food_item_id, quantity, order_date, status)
             VALUES (?,?,?,?,?)`,
            [student_id, food_item_id, quantity, new Date(), 'pending']
        )
        res.json({ order_id: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// PUT /orders/:order_id/deliver
router.put('/:order_id/deliver', async (req, res) => {
    const db = req.app.locals.db
    const { employee_id } = req.body
    const { order_id } = req.params

    try {
        const [orders] = await db.query(
            'SELECT * FROM Orders WHERE order_id = ?',
            [order_id]
        )

        if (orders.length === 0)
            return res.status(404).json({ error: 'Order not found' })

        const order = orders[0]

        // Update order. Assign employee and mark as completed.
        await db.query(
            `UPDATE Orders
             SET employee_id = ?, status = 'completed'
             WHERE order_id = ?`,
            [employee_id, order_id]
        )

        // Log transaction
        await db.query(
            `INSERT INTO Transactions (type, quantity, transaction_date, food_item_id)
             VALUES (?,?,?,?)`,
            ['sale', order.quantity, new Date(), order.food_item_id]
        )

        res.json({ message: 'Order delivered and transaction logged' })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router
