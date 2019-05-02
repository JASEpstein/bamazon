var inquirer = require('inquirer');
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var password = process.env.Password;

var choicesArr = [];
var currentStock;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazon_db",
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
    startUp();
});

function startUp() {
    createArrayOfChoices();
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
                addToInventory();
                break;
            case "Add New Product":
                console.log("Index 3");
                break;
            default:
                console.log("Default");
                connection.end();
        }
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

function createArrayOfChoices() {
    connection.query(
        "SELECT id, product_name, price, stock_quantity FROM products",
        function (err, results) {
            if (err) throw err;
            for (i = 0; i < results.length; i++) {
                var entry = 'ID: ' + results[i].id + ' | ' + results[i].product_name + " - $" + results[i].price + " - In stock: " + results[i].stock_quantity;
                choicesArr.push(entry);
            };
            return choicesArr
        }
    )
}

function getTheQuantity(queriedID) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE id=?", 
        {
            queriedID
        },
        function (err, response) {
            if (err) throw err;
            console.log(response);
            return response.stock_quantity;
        }
    );
}

function addToInventory() {
    inquirer.prompt([
        {
            name: "addToWhich",
            type: "rawlist",
            message: "Which item would you like to add more to?",
            choices: function() {
                return choicesArr;
            }
        },
        {
            name: "howMuch",
            type: "input",
            message: "How many would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answers) {
        var updateByAmt = parseInt(answers.howMuch);
        var queriedID = parseInt(answers.addToWhich.charAt(4));
        
        var currentStock = getTheQuantity(queriedID);
        console.log(currentStock);
        connection.query(
            "UPDATE products SET ? WHERE id=?",
            [   
                {
                    stock_quantity: currentStock + updateByAmt
                },
                {
                    queriedID
                }
            ],
            function (err) {
                console.log("Update Query");
                if (err) throw err;
            }
        )
    })
}