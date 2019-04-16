var inquirer = require('inquirer');
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var password = process.env.Password;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    startUp();
});

function startUp() {
    inquirer.prompt({
        name: "introMenu",
        type: "list",
        message: "Options:",
        choices: function() {
            return ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }   
    }).then(function(answers) {
        switch (answers.introMenu) {
            case "View Products for Sale":
                displayAllItems();
                break;
            case "View Low Inventory":
                checkLowInventory();
                break;
            case "Add to Inventory":
                break;
            case "Add New Product":
                console.log("Index 3");
                break;
            default:
                console.log("Default");
        }
        connection.end();
    })
}

function displayAllItems() {
    console.log("Available Stock:");
    connection.query(
        "SELECT id, product_name, price, stock_quantity FROM products",
        function(err, results) {
            if (err) throw err;
            for (i = 0; i < results.length; i++) {
                console.log('ID: ' + results[i].id + ' | ' + results[i].product_name + " - $" + results[i].price + " - In stock: " + results[i].stock_quantity);
            };
        }
    )
}

function checkLowInventory() {
    connection.query(
        "SELECT id, stock_quantity FROM products",
        function(err, results) {
            if (err) throw err;
            for (i=0; i<results.length; i++) {
                if(results[i].stock_quantity < 5) {
                    console.log("ID#: " + results[i].id + "'s stock is low!");
                }
            }
        }
    )
}