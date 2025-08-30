const mysql = require('mysql2/promise')

// XAMPP MySQL configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'canteen_db',
}

let connection

async function initDB() {
  connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  })

  const [rows] = await connection.query('SHOW DATABASES LIKE ?', [
    dbConfig.database,
  ])

  if (rows.length === 0) {
    await connection.query(`CREATE DATABASE ${dbConfig.database}`)
    await connection.query(`USE ${dbConfig.database}`)

    // Tables
    await connection.query(`
            CREATE TABLE Department (
                dept_name VARCHAR(5) PRIMARY KEY,
                building VARCHAR(50) NOT NULL,
                budget DECIMAL(10,2) NOT NULL
            )
        `)

    await connection.query(`
            CREATE TABLE Students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                dept_name VARCHAR(5) NOT NULL,
                FOREIGN KEY (dept_name) REFERENCES Department(dept_name)
            )
        `)

    await connection.query(`
            CREATE TABLE Employee (
                employee_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                role VARCHAR(30) NOT NULL,
                salary DECIMAL(10,2) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                hire_date DATE NOT NULL
            )
        `)

    await connection.query(`
            CREATE TABLE Suppliers (
                supplier_id INT AUTO_INCREMENT PRIMARY KEY,
                supplier_name VARCHAR(100) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL
            )
        `)

    await connection.query(`
            CREATE TABLE Food_Items (
                food_item_id INT AUTO_INCREMENT PRIMARY KEY,
                food_name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50) NOT NULL
            )
        `)

    await connection.query(`
            CREATE TABLE Orders (
                order_id INT AUTO_INCREMENT PRIMARY KEY,
                quantity INT NOT NULL,
                order_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL,
                employee_id INT,
                food_item_id INT NOT NULL,
                student_id INT NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
                FOREIGN KEY (food_item_id) REFERENCES Food_Items(food_item_id),
                FOREIGN KEY (student_id) REFERENCES Students(student_id)
            )
        `)

    await connection.query(`
            CREATE TABLE Transactions (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('purchase', 'sale') NOT NULL,
                quantity INT NOT NULL,
                transaction_date DATE NOT NULL,
                food_item_id INT NOT NULL,
                FOREIGN KEY (food_item_id) REFERENCES Food_Items(food_item_id)
            )
        `)

    await connection.query(`
            CREATE TABLE Food_Item_Supply (
                supply_id INT AUTO_INCREMENT PRIMARY KEY,
                quantity INT NOT NULL,
                supply_date DATE NOT NULL,
                supplier_id INT NOT NULL,
                food_item_id INT NOT NULL,
                FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id),
                FOREIGN KEY (food_item_id) REFERENCES Food_Items(food_item_id)
            )
        `)

    await connection.query(`
            CREATE TABLE Employee_Feedback (
                feedback_id INT AUTO_INCREMENT PRIMARY KEY,
                rating INT NOT NULL,
                comment VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                employee_id INT NOT NULL,
                student_id INT NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
                FOREIGN KEY (student_id) REFERENCES Students(student_id)
            )
        `)

    // insert dummy department data
    await connection.query(`
            INSERT INTO Department (dept_name, building, budget) VALUES
                ('CSE', 'Academic Bhaban', 500000.00),
                ('EEE', 'Science Building', 400000.00),
                ('BBA', 'Business Faculty', 300000.00),
                ('ENG', 'Arts Building', 250000.00);
        `)

    // Views for reports
    await connection.query(`
            CREATE VIEW TopFood AS
            SELECT f.food_name, SUM(o.quantity) AS total_ordered
            FROM Orders o
            INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
            GROUP BY f.food_name
            ORDER BY total_ordered DESC
        `)

    await connection.query(`
            CREATE VIEW PopularDepartment AS
            SELECT s.dept_name, COUNT(*) AS orders_count
            FROM Orders o
            INNER JOIN Students s ON o.student_id = s.student_id
            GROUP BY s.dept_name
            ORDER BY orders_count DESC
        `)

    await connection.query(`
            CREATE VIEW CategoryRevenue AS
            SELECT f.category, SUM(f.price * o.quantity) AS revenue
            FROM Orders o
            INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
            GROUP BY f.category
            ORDER BY revenue DESC
        `)

    await connection.query(`
            CREATE VIEW TopStudents AS
            SELECT s.first_name, s.last_name, COUNT(*) AS orders_count
            FROM Orders o
            INNER JOIN Students s ON o.student_id = s.student_id
            GROUP BY s.student_id
            ORDER BY orders_count DESC
        `)

    await connection.query(`
            CREATE VIEW TopSuppliers AS
            SELECT s.supplier_name, SUM(fs.quantity) AS total_supplied
            FROM Food_Item_Supply fs
            INNER JOIN Suppliers s ON fs.supplier_id = s.supplier_id
            GROUP BY s.supplier_id
            ORDER BY total_supplied DESC
        `)

    await connection.query(`
            CREATE VIEW DailyRevenue AS
            SELECT o.order_date, SUM(f.price * o.quantity) AS daily_revenue
            FROM Orders o
            INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
            GROUP BY o.order_date
            ORDER BY o.order_date DESC
        `)

    await connection.query(`
            CREATE VIEW EmployeeAverageRating AS
            SELECT e.first_name, e.last_name, AVG(ef.rating) AS avg_rating, COUNT(ef.feedback_id) AS feedback_count
            FROM Employee_Feedback ef
            INNER JOIN Employee e ON ef.employee_id = e.employee_id
            GROUP BY e.employee_id
            ORDER BY avg_rating DESC
        `)

    await connection.query(`
            CREATE VIEW TopFoodPerDepartment AS
            SELECT s.dept_name, f.food_name, COUNT(*) AS order_count
            FROM Orders o
            INNER JOIN Students s ON o.student_id = s.student_id
            INNER JOIN Food_Items f ON o.food_item_id = f.food_item_id
            GROUP BY s.dept_name
            ORDER BY order_count DESC
        `)

    console.log('Database initialized')
  } else {
    await connection.query(`USE ${dbConfig.database}`)
    console.log('Database exists, skipping creation')
  }

  return connection
}

module.exports = { initDB }
