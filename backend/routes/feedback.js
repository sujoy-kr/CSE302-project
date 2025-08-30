const express = require('express')
const router = express.Router()

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db

    const [rows] = await db.query(`
      SELECT 
          ef.feedback_id, 
          ef.rating, 
          ef.comment, 
          ef.date, 
          e.first_name AS employee_name, 
          s.first_name AS student_name
      FROM Employee_Feedback ef
      INNER JOIN Students s 
          ON ef.student_id = s.student_id
      INNER JOIN Employee e 
          ON ef.employee_id = e.employee_id
      ORDER BY ef.date DESC;
    `)

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST feedback
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { student_id, employee_id, rating, comment } = req.body
    await db.query(
      'INSERT INTO Employee_Feedback (student_id, employee_id, rating, comment, date) VALUES (?,?,?,?,?)',
      [student_id, employee_id, rating, comment, new Date()]
    )
    res.json({ message: 'Feedback added' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
