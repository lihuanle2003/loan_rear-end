const e = require("express");
const db = require("./index");

const findUserLimit = (userName) => {
    sql = `select limit from login_user where userName = ${userName}`
    db.query(sql, (err, value) => {
        let limit
        if (err) {
            console.log(err);
        } else {
            limit = value
        }
    })

    return limit
}

const updateUserLimit = (arr,userName, res) => {
    sql = `update login_user set allowComponent = '${arr}' where userName = '${userName}'`
    db.query(sql, (err, value) => {
        if (err) {
            console.log(err);
            res.send({
                code: 605,
                message: "数据库错误"
            })
        } else {
            res.send({
                code: 200,
                message: "权限更新成功"
            })
        }
    })
}

module.exports = findUserLimit
module.exports = updateUserLimit