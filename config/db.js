var mysql = require("mysql2/promise");

// var config =  mysql.createPool({
//     host     : 'db.wofhddl.gabia.io',
//     user     : 'wofhddl',
//     password : 'ahffktkd0!',
//     database : 'dbwofhddl',
//     connectionLimit : 30
// });

var config = mysql.createPool({
  host: "192.168.0.101",
  user: "traveler",
  password: "1212",
  database: "dasol",
  connectionLimit: 30,
});
// var config =  mysql.createPool({
//   host     : 'db.happylife.gabia.io',
//   user     : 'happylife',
//   password : 'whitegymmng!!!!',
//   database : 'dbhappylife',
//   connectionLimit : 30
// });

//쿼리문

// module.exports.SqlQuery = (QueryString,callback) =>{
//   const res = mysqlConn.query(QueryString,function (err, result, fields) {
//     if (err) console.log(err);
//     callback(err,result,fields);
//   });
// }
module.exports.SqlQuery = async function (sql, callback) {
  let rows;
  let err;
  let conn = null;
  try {
    conn = await config.getConnection();
    await conn.beginTransaction();
    const [row] = await conn.query(sql);
    rows = row;
    await conn.commit();
    conn.release();
  } catch (error) {
    err = error;
    if (conn !== null) {
      await conn.rollback();
      conn.release();
    }
  }
  callback(err, rows, null);
  //return result;
};

module.exports.SqlQuery2 = async function (sql) {
  let rows;
  let err;
  let conn = null;
  try {
    conn = await config.getConnection();
    await conn.beginTransaction();
    const [row] = await conn.query(sql);
    rows = row;
    await conn.commit();
    conn.release();
  } catch (error) {
    err = error;
    if (conn !== null) {
      await conn.rollback();
      conn.release();
    }
  }
  //callback(err,rows,null);
  return [err, rows];
};
