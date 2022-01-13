const db = require("../db/connection");
require("dotenv").config();
const inquirer = require("inquirer");
const clear = require("clear");
const chalk = require("chalk");
const mysql = require('mysql2')

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
                    "View employees by department",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Update an employee manager",
                    "Delete departments",
                    "Delete role",
                    "Delete employee",
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
                updateEmployeeRole();
            }
            if (choices === "Update an employee manager") {
                // calling update employee managerfun
                updateEmployeeManager();
            }
            if (choices === "View employees by department") {
                // calling show Employees By Department fun
                showEmployeesByDepartment();
            }
            if (choices === "Delete departments") {
                // calling deleting department fun
                deleteDepartment();
            }
            if (choices === "Delete role") {
                // calling deleting role fun
                deleteRole();
            }
            if (choices === "Delete employee") {
                // calling deleting employee fun
                deleteEmployee();
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

    const sql = `SELECT role.id, role.title, role.salary, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();

    });
};

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
            const params = input.new_dep;
            const sql = `INSERT INTO department (name)VALUES (?)`;
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(chalk.yellow.bold(input.new_dep + " Added to departments!"));

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
                    console.log(input.firstName, input.lastName + chalk.yellow.bold("Added to employees!"));
                });
                //   showing roles department
                showEmployees();
            });
    });
};
//==================================================================update Employee role function=============================================================================/

function updateEmployeeRole() {
    // grabing employees from employee table
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
                    name: "name",
                    message: "Which employee would you like to update?",
                    choices: employees,
                },
            ])
            .then((input) => {
                let params = [];
                params.push(input.name);


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
                                name: "role",
                                message: "What is the employee's new role?",
                                choices: roles,
                            },
                        ])
                        .then((input) => {
                            params.push(input.role);
                            const revRoleID = params.reverse()

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, revRoleID, (err, result) => {
                                if (err) throw err;

                                console.log(chalk.yellow.bold("Employees role has been updated!"));

                            });
                            //   showing roles department
                            showEmployees();
                        });
                });
            });

    });
};
//==================================================================update employee manger function=============================================================================/

function updateEmployeeManager() {
    // grabing employees from employee table
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
                    name: "name",
                    message: "Which employee would you like to update his manager?",
                    choices: employees,
                },
            ])
            .then((input) => {
                let params = [];
                params.push(input.name);


                inquirer
                    .prompt([

                        {
                            type: "list",
                            name: "magName",
                            message: "Who is the employee's manager?",
                            choices: employees,
                        },
                    ])
                    .then((input) => {
                        params.push(input.magName);
                        const revID = params.reverse()

                        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                        db.query(sql, revID, (err, result) => {
                            if (err) throw err;

                            console.log(chalk.yellow.bold("Employees manager has been updated!"));

                        });
                        //   showing roles department
                        showEmployees();
                    });
            });
    });


};

//==================================================================show role function=============================================================================/
function showEmployeesByDepartment() {
    clear();

    const sql = `SELECT employee.id, employee.first_name,employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();

    });
};

//==================================================================deleting department function=============================================================================/
function deleteDepartment() {
    clear();
    const depSql = `SELECT name, id FROM department`;

    db.query(depSql, (err, data) => {
        if (err) throw err;
        const deptartments = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "choices",
                    message: "Which department woud like to delete?",
                    choices: deptartments,
                },
            ])
            .then((input) => {
                const params = [input.choices];
                const sql = `DELETE FROM department WHERE id = ?`;
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(chalk.yellow.bold("Department has ben deleted!"));
                });
                //   showing roles department
                showDepartments();
            });
    });




};

//==================================================================deleting role function=============================================================================/
function deleteRole() {
    const roleSql = `SELECT * FROM role`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What role do you want to delete?",
                    choices: role
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                db.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Role has ben deleted!");

                    showRoles();
                });
            });
    });
};

//==================================================================deleting employee function=============================================================================/
function deleteEmployee() {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: "Which employee would you like to delete?",
                    choices: employees
                }
            ])
            .then(empChoice => {
                const employee = empChoice.name;

                const sql = `DELETE FROM employee WHERE id = ?`;

                db.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully Deleted!");

                    showEmployees();
                });
            });
    });
};


//==================================================================exit function=============================================================================/
function exitApp() {
    db.end();
};

module.exports = promptUser;


