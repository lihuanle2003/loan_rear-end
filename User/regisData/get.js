// 获取数据
const db = require("../../mysql")
const sqlFun = require("./sqlFun")
const Msg = require("../../msg")

function getFun(value, res) {
    let sql = sqlFun('regis', 'select', '*',null, where = value)

    // console.log(sql);
    db.query(sql, (err, value) => {
        if (err) {
            res.send(
                Msg('sqlConErr', "数据库连接错误")
            )
        }
        else{
            res.send({
                message:"连接成功",
                code:200,
                data:value
            })
        }
    })
}

// test测试数据

// getFun({user:'ikun'})

module.exports = getFun