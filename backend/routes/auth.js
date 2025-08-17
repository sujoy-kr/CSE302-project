const express = require('express')
const router = express.Router()

// POST /auth/login
router.post('/login', async (req, res) => {
    const db = req.app.locals.db
    const { userType, ID, password } = req.body

    let table = ''
    if (userType === 'student') table = 'Students'
    else if (userType === 'employee') table = 'Employee'
    else if (userType === 'supplier') table = 'Suppliers'
    else return res.status(400).json({ exists: false })

    try {
        const [results] = await db.query(
            `SELECT * FROM ${table} WHERE ID = ? AND password = ?`,
            [ID, password]
        )
        if (results.length === 0) return res.json({ exists: false })

        res.json({ exists: true })
    } catch (err) {
        res.status(500).json({ exists: false, error: err })
    }
})

module.exports = router
