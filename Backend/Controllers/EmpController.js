const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});

//.................................................................
// Create Emp (Admin Route)........................................
//.................................................................

// exports.createEmployee = async (req, res) => {
//   const {
//     date,
//     marathi_name,
//     emp_name,
//     mobile,
//     designation,
//     salary,
//     city,
//     tehsil,
//     district,
//     pincode,
//     bankName,
//     bank_ac,
//     bankIFSC,
//     password,
//   } = req.body;
//
//   const dairy_id = req.user.dairy_id;
//   const center_id = req.user.center_id;
//   const user_role = req.user.user_role;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         return res.status(500).json({ message: "Error starting transaction" });
//       }
//
//       try {
//         // Step 2: Insert into EmployeeMaster table
//         const createEmployeeQuery = `
//           INSERT INTO EmployeeMaster (
//              dairy_id, center_id, emp_name , marathi_name, emp_mobile , emp_bankname , emp_accno , emp_ifsc , emp_city , emp_tal , emp_dist , createdon, createdby , designation , salary , pincode, emp_id
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//
//         connection.query(
//           createEmployeeQuery,
//           [
//             dairy_id,
//             center_id,
//             emp_name,
//             marathi_name,
//             mobile,
//             bankName,
//             bank_ac,
//             bankIFSC,
//             city,
//             tehsil,
//             district,
//             date,
//             user_role,
//             designation,
//             salary,
//             pincode,
//             emp_id,
//           ],
//           (err, result) => {
//             if (err) {
//               return connection.rollback(() => {
//                 connection.release();
//                 console.error(
//                   "Error inserting into EmployeeMaster table: ",
//                   err
//                 );
//                 return res
//                   .status(500)
//                   .json({ message: "Database query error" });
//               });
//             }
//
//             // Step 3: Insert into users table
//             const createUserQuery = `
//               INSERT INTO users (
//                 username, password, isAdmin, createdon, createdby, designation,
//                 mobile, SocietyCode, center_id
//               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;
//
//             connection.query(
//               createUserQuery,
//               [
//                 mobile,
//                 password,
//                 1, // Assuming the user is always an admin by default
//                 date,
//                 user_role,
//                 designation,
//                 mobile,
//                 dairy_id,
//                 center_id,
//               ],
//               (err, result) => {
//                 if (err) {
//                   return connection.rollback(() => {
//                     connection.release();
//                     console.error("Error inserting into users table: ", err);
//                     return res
//                       .status(500)
//                       .json({ message: "Database query error" });
//                   });
//                 }
//
//                 // Commit transaction after both inserts succeed
//                 connection.commit((err) => {
//                   if (err) {
//                     return connection.rollback(() => {
//                       connection.release();
//                       console.error("Error committing transaction: ", err);
//                       return res
//                         .status(500)
//                         .json({ message: "Error committing transaction" });
//                     });
//                   }
//
//                   connection.release();
//                   res
//                     .status(200)
//                     .json({ message: "Employee created successfully!" });
//                 });
//               }
//             );
//           }
//         );
//       } catch (error) {
//         connection.rollback(() => {
//           connection.release();
//           console.error("Error processing request: ", error);
//           return res.status(500).json({ message: "Internal server error" });
//         });
//       }
//     });
//   });
// };

exports.createEmployee = async (req, res) => {
  const {
    date,
    marathi_name,
    emp_name,
    mobile,
    designation,
    salary,
    city,
    tehsil,
    district,
    pincode,
    bankName,
    bank_ac,
    bankIFSC,
    password,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const user_role = req.user.user_role;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ message: "Error starting transaction" });
      }

      try {
        // Step 1: Find the maximum emp_id and increment it
        const findMaxEmpIdQuery = `SELECT MAX(emp_id) AS maxEmpId FROM employeemaster WHERE dairy_id = ? AND center_id = ?`;

        connection.query(
          findMaxEmpIdQuery,
          [dairy_id, center_id],
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Error finding max emp_id: ", err);
                return res
                  .status(500)
                  .json({ message: "Database query error" });
              });
            }

            const maxEmpId = results[0].maxEmpId || 0;
            const newEmpId = maxEmpId + 1;

            // Step 2: Insert into EmployeeMaster table
            const createEmployeeQuery = `
            INSERT INTO employeemaster (
              dairy_id, center_id, emp_name, marathi_name, emp_mobile, emp_bankname, emp_accno, emp_ifsc, 
              emp_city, emp_tal, emp_dist, createdon, createdby, designation, salary, pincode, emp_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

            connection.query(
              createEmployeeQuery,
              [
                dairy_id,
                center_id,
                emp_name,
                marathi_name,
                mobile,
                bankName || null,
                bank_ac || null,
                bankIFSC || null,
                city,
                tehsil,
                district,
                date,
                user_role,
                designation,
                salary,
                pincode,
                newEmpId,
              ],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error(
                      "Error inserting into EmployeeMaster table: ",
                      err
                    );
                    return res
                      .status(500)
                      .json({ message: "Database query error" });
                  });
                }

                // Step 3: Insert into users table
                const createUserQuery = `
                INSERT INTO users (
                  username, password, isAdmin, createdon, createdby, designation, 
                  mobile, SocietyCode, center_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

                connection.query(
                  createUserQuery,
                  [
                    mobile,
                    password,
                    1, // Assuming the user is always an admin by default
                    date,
                    user_role,
                    designation,
                    mobile,
                    dairy_id,
                    center_id,
                  ],
                  (err, result) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error(
                          "Error inserting into users table: ",
                          err
                        );
                        return res
                          .status(500)
                          .json({ message: "Database query error" });
                      });
                    }

                    // Commit transaction after both inserts succeed
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          console.error("Error committing transaction: ", err);
                          return res
                            .status(500)
                            .json({ message: "Error committing transaction" });
                        });
                      }

                      connection.release();
                      res
                        .status(200)
                        .json({ message: "Employee created successfully!" });
                    });
                  }
                );
              }
            );

            // Remove the cached employee list
            const cacheKey = `employeeList_${dairy_id}_${center_id}`;
            cache.del(cacheKey);
          }
        );
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          console.error("Error processing request: ", error);
          return res.status(500).json({ message: "Internal server error" });
        });
      }
    });
  });
};

//.................................................................
// Find Employee By Code To update ................................
//.................................................................

//v2
exports.findEmpByCode = async (req, res) => {
  const { code } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const deleteEmpQuery = `
      SELECT * FROM EmployeeMaster
      WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
    `;

    connection.query(
      deleteEmpQuery,
      [dairy_id, center_id, code],
      (error, result) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ message: "Error retrieving employee data" });
        }
        return res.status(200).json({ employee: result[0] });
      }
    );
  });
};

//v3
// exports.findEmpByCode = async (req, res) => {
//   const { code } = req.body;
//
//   const dairy_id = req.user.dairy_id;
//   const center_id = req.user.center_id;
//
//   let connection;
//
//   try {
//     // Get MySQL connection
//     connection = await pool.getConnection();
//
//     const findEmpQuery = `
//       SELECT * FROM EmployeeMaster
//       WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
//     `;
//
//     // Execute the query
//     connection.query(
//       findEmpQuery,
//       [dairy_id, center_id, code],
//       (error, result) => {
//         if (error) {
//           console.error("Error executing query: ", error);
//           return res
//             .status(500)
//             .json({ message: "Error retrieving employee data" });
//         }
//
//         return res.status(200).json({ employee: result[0] });
//       }
//     );
//   } catch (error) {
//     console.error("Unexpected error: ", error);
//     return res.status(500).json({ message: "Unexpected error occurred" });
//   } finally {
//     // Ensure the connection is released
//     if (connection) {
//       connection.release();
//     }
//   }
// };

//.................................................................
// Update Emp Info (Admin Route) ..................................
//.................................................................

//v2
exports.updateEmployee = async (req, res) => {
  const {
    code,
    date,
    marathi_name,
    emp_name,
    designation,
    salary,
    city,
    tehsil,
    district,
    pincode,
    bankName,
    bank_ac,
    bankIFSC,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const user_role = req.user.user_role;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Corrected table name to EmployeeMaster
      const updateEmpQuery = `
        UPDATE EmployeeMaster
        SET
           dairy_id = ?, center_id = ?, emp_name = ?, marathi_name = ?, emp_bankname = ?, emp_accno = ?, emp_ifsc = ?, emp_city = ?, emp_tal = ?, emp_dist = ?, updatedon = ?, updatedby = ?, designation = ?, salary = ?, pincode = ?
        WHERE emp_id = ?
      `;

      connection.query(
        updateEmpQuery,
        [
          dairy_id,
          center_id,
          emp_name,
          marathi_name,
          bankName,
          bank_ac,
          bankIFSC,
          city,
          tehsil,
          district,
          date,
          user_role,
          designation,
          salary,
          pincode,
          code,
        ],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).json({ message: "Error updating employee" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
          }
          // Remove the cached employee list
          const cacheKey = `employeeList_${dairy_id}_${center_id}`;
          cache.del(cacheKey);

          return res
            .status(200)
            .json({ message: "Employee updated successfully" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// Delete Emp (Admin Route) .......................................
//.................................................................

//v2
exports.deleteEmployee = async (req, res) => {
  const { emp_id } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const deleteEmpQuery = `
        DELETE FROM EmployeeMaster
        WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
      `;

      connection.query(
        deleteEmpQuery,
        [dairy_id, center_id, emp_id],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).json({ message: "Error deleting employee" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
          }

          // Remove the cached employee list
          const cacheKey = `employeeList_${dairy_id}_${center_id}`;
          cache.del(cacheKey);

          return res
            .status(200)
            .json({ message: "Employee deleted successfully" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// Employee List (Admin Route) ....................................
//.................................................................

exports.employeeList = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query;
      let queryParams;

      if (center_id === 0) {
        // Query for center_id = 0
        query = `
          SELECT center_id, emp_name, emp_mobile, designation, salary, emp_id
          FROM EmployeeMaster
          WHERE dairy_id = ?
        `;
        queryParams = [dairy_id];
      } else {
        // Query for center_id != 0
        query = `
          SELECT center_id, emp_name, emp_mobile, designation, salary, emp_id
          FROM EmployeeMaster
          WHERE dairy_id = ? AND center_id = ?
        `;
        queryParams = [dairy_id, center_id];
      }

      connection.query(query, queryParams, (error, result) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ message: "Error retrieving employee data" });
        }
        return res.status(200).json({ empList: result });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//.................................................................
// Employee Details................................................
//.................................................................

exports.employeeDetails = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  // Construct the cache key
  const cacheKey = `employeeList_${dairy_id}_${center_id}`;

  // Check if data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({ empList: cachedData });
  }

  // If cache miss, query the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const emplist = `
      SELECT emp_name, emp_mobile, designation, salary, emp_id
      FROM EmployeeMaster
      WHERE dairy_id = ? AND center_id = ?
    `;

      connection.query(emplist, [dairy_id, center_id], (error, result) => {
        connection.release(); // Release connection back to the pool

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ message: "Error retrieving employee data" });
        }

        // Cache the result for future requests
        cache.set(cacheKey, result);

        // Return the result
        return res.status(200).json({ empList: result });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//v3
// exports.employeeList = async (req, res) => {
//   const dairy_id = req.user.dairy_id;
//   const center_id = req.user.center_id;
//
//   if (!dairy_id) {
//     return res.status(400).json({ message: "Dairy ID not found!" });
//   }
//
//   // Construct the cache key
//   const cacheKey = `employeeList_${dairy_id}_${center_id}`;
//
//   try {
//     // Check if data is already cached
//     const cachedData = cache.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json({ empList: cachedData });
//     }
//
//     // If cache miss, query the database
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error("Error getting MySQL connection: ", err);
//         return res.status(500).json({ message: "Database connection error" });
//       }
//
//       const emplist = `
//         SELECT emp_name, emp_mobile, designation, salary, emp_id
//         FROM EmployeeMaster
//         WHERE dairy_id = ? AND center_id = ?
//       `;
//
//       connection.query(emplist, [dairy_id, center_id], (error, result) => {
//         // Release connection back to the pool
//         connection.release();
//
//         if (error) {
//           console.error("Error executing query: ", error);
//           return res
//             .status(500)
//             .json({ message: "Error retrieving employee data" });
//         }
//
//         // Cache the result for future requests
//         cache.set(cacheKey, result);
//
//         // Return the result
//         return res.status(200).json({ empList: result });
//       });
//     });
//   } catch (error) {
//     console.error("Unexpected error: ", error);
//     return res.status(500).json({ message: "Unexpected error occurred" });
//   } finally {
//     connection.release();
//   }
// };
