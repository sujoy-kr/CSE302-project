const express = require('express')
const cors = require('cors')
const { initDB } = require('./db')

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const studentsRoutes = require('./routes/students')
const employeesRoutes = require('./routes/employees')
const suppliersRoutes = require('./routes/suppliers')
const foodItemsRoutes = require('./routes/food_items')
const ordersRoutes = require('./routes/orders')
const feedbackRoutes = require('./routes/feedback')
const reportsRoutes = require('./routes/reports')
const transactionsRoutes = require('./routes/transactions')

const app = express()
app.use(express.json())
app.use(cors())

async function startServer() {
  const db = await initDB()
  app.locals.db = db

  app.use('/auth', authRoutes)
  app.use('/admin', adminRoutes)
  app.use('/students', studentsRoutes)
  app.use('/employees', employeesRoutes)
  app.use('/suppliers', suppliersRoutes)
  app.use('/food-items', foodItemsRoutes)
  app.use('/orders', ordersRoutes)
  app.use('/feedback', feedbackRoutes)
  app.use('/reports', reportsRoutes)
  app.use('/transactions', transactionsRoutes)

  app.listen(3000, () => console.log('Server running on port 3000'))
}

startServer()
