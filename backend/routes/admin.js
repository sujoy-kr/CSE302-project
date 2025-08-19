const express = require('express')
const router = express.Router()

// POST /admin/add-food
router.post('/add-food', async (req, res) => {
    try {
        const { food_name, price, category } = req.body
        const db = req.app.locals.db

        const [result] = await db.query(
            `INSERT INTO Food_Items (food_name, price, category) VALUES (?, ?, ?)`,
            [food_name, price, category]
        )

        const foodItemId = result.insertId

        res.json({ message: 'Food added successfully', foodItemId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error', details: err.message })
    }
})

module.exports = router
