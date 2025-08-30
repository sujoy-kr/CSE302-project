const express = require('express')
const router = express.Router()

// GET all orders
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db

    const [rows] = await db.query(
      `SELECT 
        o.order_id,
        o.quantity,
        o.order_date,
        status,
        e.first_name AS handled_by,
        s.first_name AS ordered_by,
        f.food_name AS food_item
    FROM Orders o
    LEFT JOIN Employee e ON o.employee_id = e.employee_id
    INNER JOIN Students s ON o.student_id = s.student_id
    INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
    ORDER BY o.order_date DESC`
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST create order
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { student_id, food_item_id, quantity } = req.body

    const [result] = await db.query(
      `INSERT INTO Orders (student_id, food_item_id, quantity, order_date, status)
             VALUES (?,?,?,?,?)`,
      [student_id, food_item_id, quantity, new Date(), 'pending']
    )
    res.json({ order_id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /orders/:order_id/deliver
router.put('/:order_id/deliver', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { employee_id } = req.body
    const { order_id } = req.params

    const [orders] = await db.query('SELECT * FROM Orders WHERE order_id = ?', [
      order_id,
    ])

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
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
