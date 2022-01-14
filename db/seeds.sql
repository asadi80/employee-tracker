INSERT INTO department (name)
VALUES 
('HR'),
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');


INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 80000, 1),
('Accountant', 10000, 2), 
('Finanical Analyst', 150000, 2),
('Sales Lead', 90000, 3),
('Project Manager', 100000, 4),
('Operations Manager', 90000, 4);
('Software Engineer', 120000, 1),
('Marketing Coordindator', 70000, 3), 


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Jo', 2, null),
('Rafi', 'Roufa', 1, 1),
('Mary', 'Brown', 4, null),
('Ash', 'John', 3, 3),
('Eiko', 'Moo', 6, null),
('Abdurraouf', 'Sadi', 5, 5),
('Lewis', 'Allen', 7, null),
('Tom', 'Tom', 8, 7);
