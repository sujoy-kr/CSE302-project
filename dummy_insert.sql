
    INSERT INTO Department (dept_name, building, budget) VALUES
    ('CSE', 'Academic Bhaban', 500000.00),
    ('EEE', 'Science Building', 400000.00),
    ('BBA', 'Business Faculty', 300000.00),
    ('ENG', 'Arts Building', 250000.00);

    INSERT INTO Students (first_name, last_name, password_hash, dept_name) VALUES
    ('Rahim', 'Ahmed', 'hash1', 'CSE'),
    ('Karim', 'Hossain', 'hash2', 'EEE'),
    ('Sumaiya', 'Akter', 'hash3', 'BBA'),
    ('Nusrat', 'Jahan', 'hash4', 'ENG'),
    ('Mehedi', 'Hasan', 'hash5', 'CSE'),
    ('Taslima', 'Begum', 'hash6', 'EEE'),
    ('Fahim', 'Khan', 'hash7', 'BBA'),
    ('Sabbir', 'Rahman', 'hash8', 'CSE');

    INSERT INTO Employee (first_name, last_name, password_hash, role, salary, phone, hire_date) VALUES
    ('Abdul', 'Karim', 'hash9', 'Chef', 25000.00, '01710000001', '2023-01-15'),
    ('Selina', 'Parvin', 'hash10', 'Cashier', 18000.00, '01820000002', '2023-02-01'),
    ('Hasan', 'Mahmud', 'hash11', 'Manager', 40000.00, '01930000003', '2022-12-10'),
    ('Sharmin', 'Akter', 'hash12', 'Waiter', 15000.00, '01640000004', '2023-05-05');

    INSERT INTO Suppliers (supplier_name, password_hash, phone, email) VALUES
    ('Desh Agro Foods', 'hash13', '01750000005', 'desh@suppliers.com'),
    ('Fresh Dairy Ltd.', 'hash14', '01860000006', 'fresh@suppliers.com'),
    ('Rana Traders', 'hash15', '01970000007', 'rana@suppliers.com');

    INSERT INTO Food_Items (food_name, price, category) VALUES
    ('Shingara', 15.00, 'Snack'),
    ('Samosa', 12.00, 'Snack'),
    ('Chicken Biriyani', 120.00, 'Rice'),
    ('Tehari', 90.00, 'Rice'),
    ('Panta Ilish', 200.00, 'Traditional'),
    ('Beef Curry', 150.00, 'Curry'),
    ('Dal', 30.00, 'Curry'),
    ('Paratha', 20.00, 'Bread'),
    ('Fuchka', 50.00, 'Street Food'),
    ('Chotpoti', 40.00, 'Street Food');

    INSERT INTO Orders (quantity, order_date, status, employee_id, food_item_id, student_id) VALUES
    (3, '2025-08-01', 'Completed', 1, 1, 1),
    (2, '2025-08-01', 'Completed', 2, 3, 2),
    (1, '2025-08-02', 'Completed', 1, 5, 3),
    (4, '2025-08-02', 'Completed', 3, 4, 4),
    (2, '2025-08-03', 'Completed', 2, 2, 5),
    (5, '2025-08-03', 'Completed', 1, 6, 6),
    (2, '2025-08-04', 'Completed', 3, 7, 7),
    (3, '2025-08-04', 'Completed', 4, 8, 8),
    (6, '2025-08-05', 'Completed', 1, 9, 1),
    (5, '2025-08-05', 'Completed', 2, 10, 2);

    INSERT INTO Food_Item_Supply (quantity, supply_date, supplier_id, food_item_id) VALUES
    (200, '2025-07-25', 1, 1),
    (150, '2025-07-26', 1, 2),
    (100, '2025-07-27', 2, 3),
    (120, '2025-07-28', 2, 4),
    (80, '2025-07-29', 3, 5),
    (90, '2025-07-30', 3, 6),
    (200, '2025-07-30', 1, 7),
    (300, '2025-07-31', 1, 8),
    (100, '2025-08-01', 2, 9),
    (150, '2025-08-01', 2, 10);

    INSERT INTO Employee_Feedback (rating, comment, date, employee_id, student_id) VALUES
    (5, 'Biryani was awesome!', '2025-08-01', 1, 1),
    (4, 'Service was quick', '2025-08-01', 2, 2),
    (3, 'Food was okay', '2025-08-02', 1, 3),
    (2, 'Waited too long', '2025-08-02', 3, 4),
    (5, 'Paratha and Dal was great!', '2025-08-03', 4, 5),
    (4, 'Loved the fuchka!', '2025-08-04', 2, 6),
    (5, 'Chotpoti reminded me of street Dhaka', '2025-08-04', 1, 7);

    INSERT INTO Transactions (type, quantity, transaction_date, food_item_id) VALUES
    ('purchase', 500, '2025-07-25', 1),
    ('purchase', 400, '2025-07-26', 2),
    ('purchase', 300, '2025-07-27', 3),
    ('sale', 3, '2025-08-01', 1),
    ('sale', 2, '2025-08-01', 3),
    ('sale', 1, '2025-08-02', 5),
    ('sale', 4, '2025-08-03', 2),
    ('sale', 6, '2025-08-05', 9),
    ('sale', 5, '2025-08-05', 10);
 



 