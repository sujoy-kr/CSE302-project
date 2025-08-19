const express = require('express')
const router = express.Router()
const { hash } = require('../utils/bcrypt')

// GET all employees
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db
        const [rows] = await db.query(
            'SELECT employee_id, first_name, last_name, role, salary, phone, hire_date FROM Employee'
        )
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// POST add employee
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db
        const { first_name, last_name, role, salary, phone, password } =
            req.body

        const password_hash = await hash(password)

        const [result] = await db.query(
            'INSERT INTO Employee (first_name, last_name, role, salary, phone, hire_date, password_hash) VALUES (?,?,?,?,?,?,?)',
            [
                first_name,
                last_name,
                role,
                salary,
                phone,
                new Date(),
                password_hash,
            ]
        )
        res.json({ employee_id: result.insertId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
