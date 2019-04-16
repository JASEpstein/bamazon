DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
id int not null AUTO_INCREMENT,
product_name varchar(255),
department_name varchar(255),
price int(2),
stock_quantity int,
primary key (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("Snuggie", "Home Goods", 29.95, 3),
    ("Arduino Uno 3", "Electronics", 34.95, 4),
    ("KitchenAid Standing Mixer", "Kitchen", 159.45, 3),
    ("Dishwasher Tablets", "Cleaning Products", 12.99, 6),
    ("iPhone 6s", "Cell Phones", 649.34, 12),
    ("Game of Thrones DVD Set", "Entertainment", 32, 8),
    ("NASA Flight Jacket", "Clothing", 150, 3),
    ("MySQL Cookbook, by Paul DuBois", "Books", 45, 2),
    ("Ryobi Hammer Drill", "Tools", 179, 4),
    ("Inflatable Pool", "Outdoor Recreation", 45, 7);

