const express = require('express')
const router = express.Router()
const { compare } = require('../utils/bcrypt')

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const db = req.app.locals.db
        const { userType, ID, password } = req.body

        let table = ''
        let idField = ''
        if (userType === 'student') {
            table = 'Students'
            idField = 'student_id'
        } else if (userType === 'employee') {
            table = 'Employee'
            idField = 'employee_id'
        } else if (userType === 'supplier') {
            table = 'Suppliers'
            idField = 'supplier_id'
        } else {
            return res
                .status(400)
                .json({ exists: false, error: 'Invalid userType' })
        }

        const [results] = await db.query(
            `SELECT * FROM ${table} WHERE ${idField} = ?`,
            [ID]
        )

        if (results.length === 0) {
            return res.json({ exists: false })
        }

        const user = results[0]

        const match = await compare(password, user.password_hash)

        if (!match) {
            return res.json({ exists: false })
        }

        res.json({ exists: true, user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
