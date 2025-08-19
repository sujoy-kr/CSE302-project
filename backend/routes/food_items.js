const express = require('express')
const router = express.Router()

// GET all food items
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db
        const [rows] = await db.query('SELECT * FROM Food_Items')
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// POST add food item
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db
        const { food_name, price, category } = req.body
        const [result] = await db.query(
            'INSERT INTO Food_Items (food_name, price, category) VALUES (?,?,?)',
            [food_name, price, category]
        )
        res.json({ food_item_id: result.insertId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
