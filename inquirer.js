const promptUser = () => {

const inquirer = require('inquirer');
const fs = require('fs');

inquirer
.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View departments', 
                  'View roles', 
                  'View employees', 
                  'Add a department', 
                  'Add a role', 
                  'Add an employee', 
                  'Update an employee role',
                  'Update an employee manager',
                  "View employees by department",
                  'Delete a department',
                  'Delete a role',
                  'Delete an employee',
                  'View department budgets']
      }
    ])

    .then (data=>{
      const result = generateReadme (data);
      fs.writeFileSync(".ReadME.md", result)
  })


      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View departments") {
          showDepartments();
        }
  
        if (choices === "View roles") {
          showRoles();
        }
  
        if (choices === "View employees") {
          showEmployees();
        }
  
        if (choices === "Add a department") {
          addDepartment();
        }
  
        if (choices === "Add a role") {
          addRole();
        }
  
        if (choices === "Add an employee") {
          addEmployee();
        }
  
        if (choices === "Update an employee role") {
          updateEmployee();
        }
  
        if (choices === "Update an employee manager") {
          updateManager();
        }
  
        if (choices === "View employees by department") {
          employeeDepartment();
        }
  
        if (choices === "Delete a department") {
          deleteDepartment();
        }
  
        if (choices === "Delete a role") {
          deleteRole();
        }
  
        if (choices === "Delete an employee") {
          deleteEmployee();
        }
  
        if (choices === "View department budgets") {
          viewBudget();
        }

  
  showDepartments = () => {
    console.log('all departments');
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };
  
  showRoles = () => {
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      promptUser();
      console.log('roles');
    })
  };
  
showEmployees = () => {
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      promptUser();
      console.log('employees'); 
    });
  };
  
  addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          showDepartments();
      });
    });
  };
  
  addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (isNAN(addSalary)) {
              return true;
          } else {
              console.log('enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
  
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What's the role of this Department?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + "roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };
  
  addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('enter the first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('enter the last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.fistName, answer.lastName]
    
      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the role of the employee?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                connection.promise().query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };
  
  updateEmployee = () => {
  
    connection.promise().query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          connection.promise().query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee has been updated!");
                
                  showEmployees();
            });
          });
        });
      });
    });
  };
  
  updateManager = () => {
  
    connection.promise().query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
            connection.promise().query(managerSql, (err, data) => {
              if (err) throw err; 
  
            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
              
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager); 
                      
                      let employee = params[0]
                      params[0] = manager
                      params[1] = employee 
    
  
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  
                      connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                      console.log("Employee has been updated!");
                    
                      showEmployees();
            });
          });
        });
      });
    });
  };
  
  employeeDepartment = () => {
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      promptUser();
      console.log('employee by departments');
    });          
  };
  
  deleteDepartment = () => {
  
    connection.promise().query(deptSql, (err, data) => {
      if (err) throw err; 
  
      const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department do you want to delete?",
          choices: dept
        }
      ])
        .then(deptChoice => {
          const dept = deptChoice.dept;
          const sql = `DELETE FROM department WHERE id = ?`;
  
          connection.query(sql, dept, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 
  
          showDepartments();
        });
      });
    });
  };
  
  deleteRole = () => {
  
    connection.promise().query(roleSql, (err, data) => {
      if (err) throw err; 
  
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
  
      inquirer.prompt([
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
  
          connection.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 
  
            showRoles();
        });
      });
    });
  };
  
  deleteEmployee = () => {
  
    connection.promise().query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
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
  
          connection.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log("Successfully Deleted!");
          
            showEmployees();
      });
    });
   });
  };
  
  viewBudget = () => {
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      promptUser();
      console.log('budget by department');
    });           
},