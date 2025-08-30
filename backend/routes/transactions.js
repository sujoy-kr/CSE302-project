const express = require('express')
const router = express.Router()

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db

    const [rows] = await db.query(`
            SELECT 
                t.transaction_id, 
                t.type, 
                t.quantity, 
                t.transaction_date, 
                f.food_name
            FROM 
                Transactions t
            INNER JOIN 
                Food_Items f 
                ON t.food_item_id = f.food_item_id
            ORDER BY 
                t.transaction_date DESC
        `)

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
// POST add a transaction
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { type, quantity, food_item_id } = req.body

    const [result] = await db.query(
      'INSERT INTO Transactions (type, quantity, transaction_date, food_item_id) VALUES (?,?,?,?)',
      [type, quantity, new Date(), food_item_id]
    )
    res.json({ transaction_id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
