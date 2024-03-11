const mysql = require("mysql");

// 创建连接
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loanservedata"
});

// 暴露对象
module.exports = db