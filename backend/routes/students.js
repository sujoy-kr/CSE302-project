const express = require('express')
const router = express.Router()
const { hash } = require('../utils/bcrypt')

// GET all students
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db

        const [rows] = await db.query(
            'SELECT student_id, first_name, last_name, dept_name FROM Students'
        )
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// POST add new student
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db

        const { first_name, last_name, dept_name, password } = req.body
        const password_hash = await hash(password)

        const [result] = await db.query(
            'INSERT INTO Students (first_name, last_name, dept_name, password_hash) VALUES (?,?,?,?)',
            [first_name, last_name, dept_name, password_hash]
        )

        res.json({ student_id: result.insertId })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
