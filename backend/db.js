const mysql = require("mysql2/promise");

// XAMPP MySQL configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "canteen_db",
};

let connection;

async function initDB() {
  connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  const [rows] = await connection.query("SHOW DATABASES LIKE ?", [
    dbConfig.database,
  ]);

  if (rows.length === 0) {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    await connection.query(`USE ${dbConfig.database}`);

    // Tables
    await connection.query(`
            CREATE TABLE IF NOT EXISTS Department (
                dept_name VARCHAR(5) PRIMARY KEY,
                building VARCHAR(50) NOT NULL,
                budget DECIMAL(10,2) NOT NULL
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                dept_name VARCHAR(5) NOT NULL,
                FOREIGN KEY (dept_name) REFERENCES Department(dept_name)
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Employee (
                employee_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                role VARCHAR(30) NOT NULL,
                salary DECIMAL(10,2) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                hire_date DATE NOT NULL
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Suppliers (
                supplier_id INT AUTO_INCREMENT PRIMARY KEY,
                supplier_name VARCHAR(100) NOT NULL,
                password_hash VARCHAR(200) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Food_Items (
                food_item_id INT AUTO_INCREMENT PRIMARY KEY,
                food_name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50) NOT NULL
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Orders (
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
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Transactions (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(20) NOT NULL,
                quantity INT NOT NULL,
                transaction_date DATE NOT NULL,
                food_item_id INT NOT NULL,
                FOREIGN KEY (food_item_id) REFERENCES Food_Items(food_item_id)
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Food_Item_Supply (
                supply_id INT AUTO_INCREMENT PRIMARY KEY,
                quantity INT NOT NULL,
                supply_date DATE NOT NULL,
                supplier_id INT NOT NULL,
                food_item_id INT NOT NULL,
                FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id),
                FOREIGN KEY (food_item_id) REFERENCES Food_Items(food_item_id)
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS Employee_Feedback (
                feedback_id INT AUTO_INCREMENT PRIMARY KEY,
                rating INT NOT NULL,
                comment VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                employee_id INT NOT NULL,
                student_id INT NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
                FOREIGN KEY (student_id) REFERENCES Students(student_id)
            )
        `);

    await connection.query(`
            INSERT INTO Department (dept_name, building, budget) VALUES 
                ('CSE', 'main building', 500000.00),
                ('MPS', 'fub', 300000.00),
                ('ECO', 'ab3', 200000.00)
        `);

    console.log("Database initialized");
  } else {
    await connection.query(`USE ${dbConfig.database}`);
    console.log("Database exists, skipping creation");
  }

  return connection;
}

module.exports = { initDB };
