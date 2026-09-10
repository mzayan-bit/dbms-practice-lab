-- Create a simple table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INT
);

-- Insert some dummy data
INSERT INTO employees (name, age) VALUES 
('Alice', 30),
('Bob', 25),
('Charlie', 30);

-- Retrieve all data
SELECT * FROM employees;
