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
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
        )
        await connection.query(`USE ${dbConfig.database}`)

        // Tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Department (
                name VARCHAR(3) PRIMARY KEY,
                building VARCHAR(50),
                budget DECIMAL(10,2)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Students (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                password VARCHAR(255),
                dept_name VARCHAR(100),
                FOREIGN KEY (dept_name) REFERENCES Department(name)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Employee (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                password VARCHAR(255),
                role VARCHAR(50),
                salary DECIMAL(10,2),
                phone VARCHAR(20),
                hire_date DATE
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Suppliers (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                supplier_name VARCHAR(100),
                password VARCHAR(255),
                phone VARCHAR(20),
                email VARCHAR(100)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Food_Items (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                food_name VARCHAR(100),
                price DECIMAL(10,2),
                category VARCHAR(50)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Orders (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                student_ID INT,
                food_item_ID INT,
                quantity INT,
                order_date DATETIME,
                status ENUM('pending','completed','cancelled'),
                FOREIGN KEY (student_ID) REFERENCES Students(ID),
                FOREIGN KEY (food_item_ID) REFERENCES Food_Items(ID)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Food_Item_Supply (
                supplier_ID INT,
                food_item_ID INT,
                quantity INT,
                supply_date DATETIME,
                PRIMARY KEY(supplier_ID, food_item_ID, supply_date),
                FOREIGN KEY (supplier_ID) REFERENCES Suppliers(ID),
                FOREIGN KEY (food_item_ID) REFERENCES Food_Items(ID)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Order_Delivery (
                employee_ID INT,
                order_ID INT,
                PRIMARY KEY(employee_ID, order_ID),
                FOREIGN KEY (employee_ID) REFERENCES Employee(ID),
                FOREIGN KEY (order_ID) REFERENCES Orders(ID)
            )
        `)

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Employee_Feedback (
                student_ID INT,
                employee_ID INT,
                rating INT CHECK(rating BETWEEN 1 AND 5),
                comment TEXT,
                date DATETIME,
                PRIMARY KEY(student_ID, employee_ID, date),
                FOREIGN KEY (student_ID) REFERENCES Students(ID),
                FOREIGN KEY (employee_ID) REFERENCES Employee(ID)
            )
        `)

        await connection.query(`
            INSERT INTO Department (name, building, budget) VALUES 
                ('CSE', 'main building', 500000.00),
                ('MPS', 'fub', 300000.00),
                ('ECO', 'ab3', 200000.00)
        `)

        console.log('Database initialized')
    } else {
        await connection.query(`USE ${dbConfig.database}`)
        console.log('Database exists, skipping creation')
    }

    return connection
}

module.exports = { initDB }
