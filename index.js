// // const express = require("express");
// // const session = require("express-session");
// // const app = express();

// const mysql = require("mysql");
// const connection = mysql.createConnection({
//   host: "192.168.0.101",
//   user: "traveler",
//   password: "1212",
//   database: "dasol",
// });

// connection.connect();

// connection.query("SELECT * from Users;", (error, rows, fields) => {
//   if (error) throw error;
//   console.log("User info is: ", rows);
// });

// connection.end();

const mysql = require("./config/db");

callmysql();

async function callmysql() {
  const [err, result] = await mysql.SqlQuery2("select * from Users");

  console.log(result);
}
