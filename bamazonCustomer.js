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

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to MySQL");
    displayAllItems();
});

function displayAllItems() {
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
            console.log('Stock Updated!');
            // displayUpdatedStock(productIndex);
            connection.end();
        }
    )
} 

function selectProduct(results) {
    var currentTotal;
    inquirer.prompt([
        {
        name: "productID",
        type: "input",
        message: "Enter the ID of the product you want to buy",
        validate: function (value) {
            if (isNaN(value) === false) {
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
            if (isNaN(value) === false) {
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
            currentTotal += selectedProductIndex.price;
            console.log('====================');
            console.log('Cart Balance: $' + currentTotal);
            inquirer.prompt([
                {
                    name: "checkoutOrShop",
                    type: "list",
                    message: "What would you like to do now?",
                    choices: [
                        
                    ]
                }
            ])
        } else {
            console.log('Insufficient quantity - canceling order...');
            console.log('Order canceled.');
            connection.end();
        }
        
    })
}






