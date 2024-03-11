// 存入数据
const db = require("../../mysql/index.js")
// sql语句拼装
const sqlFun = require("./sqlFun.js")
const Msg = require("../../msg/index.js")

const tableName = 'regis'

const columns = ['registration_record', 'user', 'submitDate']


// 测试用数据
let value = {
    registration_record:'123',
    user:"ikun",
    submitDate:"2024-01-02"
}
function putFun(value,res) {
    let sql = sqlFun(tableName,'insert',columns,value)

    // 数据库操作
    db.query(sql,(err,value)=>{
        if(err){
            console.log(err);
            res.send(Msg("sqlConErr","数据库连接错误"))
            return
        }else{
            res.send(Msg("successCon","存入数据成功"))
        }
    })
}

module.exports = putFun