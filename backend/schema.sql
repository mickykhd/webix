-- Webix Reports Manager Database Schema
-- Run this file to set up the required tables and sample data
-- Usage: mysql -u <user> -p <database> < schema.sql

CREATE DATABASE IF NOT EXISTS reports_db;
USE reports_db;

-- ============= WEBIX INTERNAL TABLES =============

-- Reports/modules storage (used by Webix Reports widget)
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Report',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Saved queries storage (used by Webix Reports widget)
CREATE TABLE IF NOT EXISTS queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Query',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============= DATA TABLES =============

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  city VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  total_amount DECIMAL(10,2) DEFAULT 0,
  order_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============= SAMPLE DATA =============

INSERT INTO products (name, price, category, stock) VALUES
  ('Laptop Pro', 1299.99, 'Electronics', 45),
  ('Wireless Mouse', 29.99, 'Electronics', 120),
  ('Office Desk', 399.99, 'Furniture', 30),
  ('Ergonomic Chair', 249.99, 'Furniture', 25),
  ('USB Cable', 9.99, 'Accessories', 200),
  ('Monitor 27"', 349.99, 'Electronics', 60),
  ('Laptop Pro', 1000.00, 'Electronics', 100);

INSERT INTO customers (name, email, phone, city, country) VALUES
  ('Alice Johnson', 'alice@example.com', '+1-555-0101', 'New York', 'USA'),
  ('Bob Smith', 'bob@example.com', '+44-20-7946-0102', 'London', 'UK'),
  ('Charlie Brown', 'charlie@example.com', '+33-1-70-36-0103', 'Paris', 'France'),
  ('Diana Prince', 'diana@example.com', '+49-30-1234-0104', 'Berlin', 'Germany'),
  ('Eve Wilson', 'eve@example.com', '+81-3-1234-0105', 'Tokyo', 'Japan'),
  ('Frank Miller', 'frank@example.com', '+61-2-1234-0106', 'Sydney', 'Australia'),
  ('Grace Lee', 'grace@example.com', '+1-416-555-0107', 'Toronto', 'Canada'),
  ('Henry Davis', 'henry@example.com', '+1-555-0108', 'New York', 'USA'),
  ('Iris Chen', 'iris@example.com', '+44-20-7946-0109', 'London', 'UK'),
  ('Jack Taylor', 'jack@example.com', '+33-1-70-36-0110', 'Paris', 'France');

INSERT INTO orders (customer_id, product_id, quantity, total_amount, order_date, status) VALUES
  (1, 1, 1, 1299.99, '2024-01-15', 'completed'),
  (1, 6, 1, 349.99, '2024-01-15', 'completed'),
  (2, 2, 2, 59.98, '2024-01-16', 'completed'),
  (2, 5, 3, 29.97, '2024-01-16', 'completed'),
  (3, 3, 1, 399.99, '2024-02-01', 'completed'),
  (3, 4, 1, 249.99, '2024-02-01', 'completed'),
  (4, 1, 1, 1299.99, '2024-02-10', 'completed'),
  (4, 2, 1, 29.99, '2024-02-10', 'completed'),
  (5, 5, 5, 49.95, '2024-03-05', 'completed'),
  (5, 6, 1, 349.99, '2024-03-05', 'completed'),
  (6, 3, 1, 399.99, '2024-03-15', 'completed'),
  (6, 4, 2, 499.98, '2024-03-15', 'completed'),
  (7, 1, 1, 1299.99, '2024-04-01', 'completed'),
  (7, 2, 3, 89.97, '2024-04-01', 'completed'),
  (8, 6, 2, 699.98, '2024-04-20', 'pending'),
  (8, 5, 10, 99.90, '2024-04-20', 'pending'),
  (9, 3, 1, 399.99, '2024-05-10', 'completed'),
  (9, 4, 1, 249.99, '2024-05-10', 'completed'),
  (10, 1, 1, 1299.99, '2024-05-25', 'completed'),
  (10, 2, 2, 59.98, '2024-05-25', 'completed'),
  (1, 7, 1, 1000.00, '2024-06-01', 'completed'),
  (2, 3, 1, 399.99, '2024-06-15', 'completed'),
  (3, 6, 1, 349.99, '2024-07-01', 'pending'),
  (4, 5, 4, 39.96, '2024-07-20', 'completed'),
  (5, 4, 1, 249.99, '2024-08-05', 'completed'),
  (6, 1, 1, 1299.99, '2024-08-15', 'completed'),
  (7, 7, 1, 1000.00, '2024-09-01', 'completed'),
  (8, 2, 5, 149.95, '2024-09-20', 'completed'),
  (9, 6, 1, 349.99, '2024-10-10', 'completed'),
  (10, 3, 1, 399.99, '2024-10-25', 'completed');
