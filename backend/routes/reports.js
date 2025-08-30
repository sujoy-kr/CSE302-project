const express = require('express')
const router = express.Router()

router.get('/top-food', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM TopFood')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/popular-department', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM PopularDepartment')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/category-revenue', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM CategoryRevenue')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/top-students', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM TopStudents')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/top-suppliers', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM TopSuppliers')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/daily-revenue', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM DailyRevenue')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/employee-average-rating', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM EmployeeAverageRating')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/top-food-per-department', async (req, res) => {
  const db = req.app.locals.db
  try {
    const [rows] = await db.query('SELECT * FROM TopFoodPerDepartment')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
