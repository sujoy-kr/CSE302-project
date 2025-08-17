const express = require('express')
const router = express.Router()

// POST /admin/buy-food
router.post('/buy-food', (req, res) => {
    const { food_item_id, supplier_id, quantity } = req.body
    const db = req.app.locals.db
    db.query(
        `UPDATE Food_Item_Supply SET quantity = quantity + ? WHERE supplier_id = ? AND food_item_id = ?`,
        [quantity, supplier_id, food_item_id],
        (err) => {
            if (err) return res.status(500).json({ error: err })
            res.json({ message: 'Food purchased successfully' })
        }
    )
})

module.exports = router
