const express = require('express')
const { hash } = require('../utils/bcrypt')
const router = express.Router()

// GET all suppliers
router.get('/', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query('SELECT * FROM Suppliers')
    res.json(rows)
})

// POST supplier
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db
        const { supplier_name, phone, email, password } = req.body

        const password_hash = await hash(password)

        // Insert into DB
        const [result] = await db.query(
            'INSERT INTO Suppliers (supplier_name, phone, email, password_hash) VALUES (?,?,?,?)',
            [supplier_name, phone, email, password_hash]
        )

        res.json({ supplier_id: result.insertId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// POST /suppliers/supply-food
router.post('/supply-food', async (req, res) => {
    const { food_item_id, supplier_id, quantity } = req.body
    const db = req.app.locals.db

    try {
        // Insert into Food_Item_Supply
        const [supplyResult] = await db.query(
            `INSERT INTO Food_Item_Supply (supplier_id, food_item_id, quantity, supply_date)
             VALUES (?,?,?,?)`,
            [supplier_id, food_item_id, quantity, new Date()]
        )

        // Log transaction
        await db.query(
            `INSERT INTO Transactions (type, quantity, transaction_date, food_item_id)
             VALUES (?,?,?,?)`,
            ['purchase', quantity, new Date(), food_item_id]
        )

        res.json({
            message: 'Food purchased successfully',
            supply_id: supplyResult.insertId,
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router
