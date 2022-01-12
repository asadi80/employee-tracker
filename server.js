//======== importing all the required methods 
const fs = require("fs");
const clear = require("clear");
const figlet = require("figlet");
const mysql = require("mysql2");
const chalk = require("chalk");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();
const db = require("./db/connection");
const promptUser = require("./functions/index");
const { promise } = require("./db/connection");
// ==========================================================

// ======= connecting to database and start the app
db.connect((err) => {
    if (err) throw err;
    console.log("Database connected.");
    init();
});

init = () => {
    clear();
    console.log(
        chalk.yellow.bold(
            `================================================================================================`
        )
    );
    console.log(chalk.greenBright.bold(figlet.textSync("EMPLOYEE TRACKER")));
    console.log(chalk.blue.bold("Done by Abdurraouf Sadi"));
    console.log(
        chalk.yellow.bold(
            `================================================================================================`
        )
    );
    // calling prompt user function 
    promptUser();
};




