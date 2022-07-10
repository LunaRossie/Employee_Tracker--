INSERT INTO department (name)
VALUES 
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Administrator', 90000, 1),
('Software Engineer', 110000, 1),
('Controller', 100000, 2), 
('Financial Analyst', 120000, 2),
('Marketing Coordindator', 75000, 3), 
('Sales Manager', 85000, 3),
('Project Manager', 95000, 4),
('Director of Operations', 110000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Devon', 'Johnson', 2, null),
('Larry', 'Dougherty', 1, 1),
('Susan', 'James', 4, null),
('Jeniffer', 'Brown', 3, 3),
('Kenneth', 'Cuthbert', 6, null),
('Liza', 'Myer', 5, 5),
('Joshua', 'Bryant', 7, null),
('Melissa', 'Gillam', 8, 7);