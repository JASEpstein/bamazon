var inquirer = require('inquirer');
var mysql = require('mysql');
var dotenv = require('dotenv').config();
var password = process.env.Password;

var currentTotal = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
    displayAllItems();
});

function displayAllItems() {
    console.log("Available Stock:");
    connection.query(
        "SELECT id, product_name, price, stock_quantity FROM products", 
        function (err, results) {
            if (err) throw err;
            for(i=0; i<results.length; i++){
                console.log('ID: ' + results[i].id + ' | ' + results[i].product_name + " - $" + results[i].price + " - In stock: " + results[i].stock_quantity);
            };
        selectProduct(results);
        }
    )
}

function updateDatabaseStock(quantityOrdered, productIndex, currentStock) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: currentStock - quantityOrdered
            },
            {
                id: productIndex
            }
        ],
        function(err){
            if (err) throw err;
        }
    )
} 

function selectProduct(results) {
    inquirer.prompt([
        {
        name: "productID",
        type: "input",
        message: "Enter the ID number of the product you want to buy",
        validate: function (value) {
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
        },
        {
        name: "quantity",
        type: "input",
        message: "How many would you like?",
        validate: function (value) {
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
        }
    ]).then(function(answers) {
        var selectedProductIndex = results[answers.productID - 1]
        var selectedStockAmt = selectedProductIndex.stock_quantity;
        if (selectedStockAmt >= answers.quantity){
            updateDatabaseStock(answers.quantity, answers.productID, selectedStockAmt);
            currentTotal += parseInt(selectedProductIndex.price);
            console.log('====================');
            console.log('Cart Balance: $' + currentTotal);
            inquirer.prompt([
                {
                    name: "checkoutOrShop",
                    type: "list",
                    message: "What would you like to do now?",
                    choices:
                        [
                        "Continue Shopping", "Checkout"
                        ]
                }
            ]).then(function(answers){
                var res = answers.checkoutOrShop
                if (res === "Continue Shopping"){ 
                    displayAllItems();
                } else {
                    console.log("Your credit card has been charged $" + currentTotal);
                    console.log("Shop with us again!");
                    console.log("------------------");
                    connection.end();
                }
            })
        } else {
            console.log('Insufficient quantity - canceling order...');
            console.log('Order canceled.');
            connection.end();
        }
        
    })
}






