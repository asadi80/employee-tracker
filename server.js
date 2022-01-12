const fs = require("fs");
const path = require("path");
var clear = require("clear");
var figlet = require("figlet");
const mysql = require("mysql2");
const chalk = require("chalk");
// import inquirer
const inquirer = require("inquirer");
// import console.table
const cTable = require("console.table");
// const showDepartments = ('./functions/index')
require("dotenv").config();
const db = require("./db/connection");
const e = require("./functions/index");

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
    console.log(
        chalk.yellow.bold(
            `================================================================================================`
        )
    );
    promptUser();
};

const promptUser = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choices",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "EXIT",
                ],
            },
        ])
        .then((input) => {
            const { choices } = input;

            if (choices === "View all departments") {
                // calling departments fun
                showDepartments();
            }

            if (choices === "View all roles") {
                // calling show roles fun
                showRoles();
            }
            if (choices === "View all employees") {
                // calling show roles fun
                showEmployees();
            }
            if (choices === "Add a department") {
                // calling add department fun
                addDepartment();
            }
            if (choices === "Add a role") {
                // calling add role fun
                addRole();
            }
            if (choices === "Add an employee") {
                // calling add employee fun
                addEmployee();
            }
            if (choices === "Update an employee role") {
                // calling update employee fun
                updateEmployee();
            }

            if (choices === "EXIT") {
                // calling exit fun
                exitApp();
            }
        });
};

//==================================================================update departments function=============================================================================/
function showDepartments() {
    clear();
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );
    console.log(
        `                              ` + chalk.green.bold(`ALL DEPARTMENTS`)
    );
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//==================================================================show role function=============================================================================/
function showRoles() {
    clear();
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );
    console.log(`                              ` + chalk.green.bold(`ALL ROLES`));
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );
    // connection.query("SELECT role.id, role.salary, role.title, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 

    const sql = `SELECT role.id, role.title, role.salary, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 

//==================================================================show Employee function=============================================================================/
function showEmployees() {
    clear();
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );
    console.log(
        `                              ` + chalk.green.bold(`ALL EMPLOYEES`)
    );
    console.log(
        chalk.yellow.bold(
            `====================================================================================`
        )
    );


    const sql = `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//==================================================================update department function=============================================================================/

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "new_dep",
                message: "What department do you want to add?",
                validate: (new_dep) => {
                    if (new_dep) {
                        return true;
                    } else {
                        console.log("Please enter a department");
                        return false;
                    }
                },
            },
        ])
        .then((input) => {
            const sql = `INSERT INTO department (name)
                      VALUES (?)`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log(chalk.yellow.bold("Added " + input.new_dep + " to departments!"));

                showDepartments();
            });
        });
};

//==================================================================update role function=============================================================================/

let deptartments, roles;
function addRole() {
    // grab dept from department table
    const depSql = `SELECT name, id FROM department`;

    db.query(depSql, (err, data) => {
        if (err) throw err;

        deptartments = data.map(({ name, id }) => ({ name: name, value: id }));

        //
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "new_role",
                    message: "What role do you want to add?",
                    validate: (new_role) => {
                        if (new_role) {
                            return true;
                        } else {
                            console.log("Please enter a role");
                            return false;
                        }
                    },
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of this role?",
                    validate: (salary) => {
                        if (salary) {
                            return true;
                        } else {
                            console.log("Please enter a salary.");
                            return false;
                        }
                    },
                },
                {
                    type: "list",
                    name: "choices",
                    message: "What department is this role in?",
                    choices: deptartments,
                },
            ])
            .then((input) => {
                const params = [input.new_role, input.salary, input.choices];
                const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?,?,?)`;
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(chalk.yellow.bold("Added" + input.role + "to roles!"));
                });
                //   showing roles department
                showRoles();
            });
    });
};

//==================================================================add Employee function=============================================================================/

function addEmployee() {
    // grab role from roles table
    const roleSql = `SELECT title, id FROM role`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        roles = data.map(({ title, id }) => ({
            name: title,
            value: id,
        }));
        //
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?",
                    validate: (firstName) => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log("Please employee's first name");
                            return false;
                        }
                    },
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?",
                    validate: (lastName) => {
                        if (lastName) {
                            return true;
                        } else {
                            console.log("Please enter employee's last name");
                            return false;
                        }
                    },
                },
                {
                    type: "list",
                    name: "choices",
                    message: "What is the employee's role?",
                    choices: roles,
                },
                {
                    type: "input",
                    name: "managerID",
                    message: "What is the employee's manager's ID?",
                    validate: (managerID) => {
                        if (managerID) {
                            return true;
                        } else {
                            console.log("Please enter manager's ID");
                            return false;
                        }
                    },
                },
            ])
            .then((input) => {
                const params = [
                    input.firstName,
                    input.lastName,
                    input.choices,
                    input.managerID,
                ];
                const sql = `INSERT INTO employee (first_name, last_name, role_id ,manager_id)
                    VALUES (?,?,?,?)`;
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(input.firstName, input.lastName + chalk.yellow.bold ("Added to employees!"));
                });
                //   showing roles department
                showEmployees();
            });
    });
};
//==================================================================update Employee function=============================================================================/

let param = [];
function updateEmployee() {
    // grabing role from roles table
    const empSql = `SELECT first_name, last_name, id FROM employee`;
    db.query(empSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "choices",
                    message: "Which employee would you like to update?",
                    choices: employees,
                }
            ])
            .then((input) => {

                param.push(input.choices);
                console.log(param);
            });
    });

    // grab role from roles table
    const roleSql = `SELECT title, id FROM role`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        roles = data.map(({ title, id }) => ({
            name: title,
            value: id,
        }));
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "choices",
                    message: "What is the employee's new role?",
                    choices: roles,
                }
            ])
            .then((input) => {
                param.push(input.choices);
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                db.query(sql, param, (err, result) => {
                    if (err) throw err;
                    console.log(chalk.yellow.bold("Employees role has been updated!"));
                });
                //   showing roles department
                showEmployees();
            });

    });
};
//==================================================================exit function=============================================================================/

function exitApp() {
    db.end();
};
