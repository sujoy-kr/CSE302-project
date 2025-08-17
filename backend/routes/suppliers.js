const express = require('express')
const router = express.Router()

// GET all suppliers
router.get('/', async (req, res) => {
    const db = req.app.locals.db
    const [rows] = await db.query('SELECT * FROM Suppliers')
    res.json(rows)
})

// POST supplier
router.post('/', async (req, res) => {
    const db = req.app.locals.db
    const { supplier_name, phone, email, password } = req.body
    const [result] = await db.query(
        'INSERT INTO Suppliers (supplier_name, phone, email, password) VALUES (?,?,?,?)',
        [supplier_name, phone, email, password]
    )
    res.json({ result })
})

// POST /suppliers/add-food
router.post('/add-food', (req, res) => {
    const { supplier_id, food_name, price, category } = req.body
    const db = req.app.locals.db
    db.query(
        `INSERT INTO Food_Items (food_name, price, category) VALUES (?, ?, ?)`,
        [food_name, price, category],
        (err, result) => {
            if (err) return res.status(500).json({ error: err })
            // Link supplier and food
            db.query(
                `INSERT INTO Food_Item_Supply (supplier_id, food_item_id, quantity, supply_date) VALUES (?, ?, ?, ?)`,
                [supplier_id, result.insertId, 0, new Date()],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 })
                    res.json({ message: 'Food added successfully' })
                }
            )
        }
    )
})

module.exports = router
