// 获取数据
const db = require("../../mysql")
const sqlFun = require("./sqlFun")

function getFun(value,res){
    console.log(value.user);
    let sql = sqlFun('regis','select','*',value = undefined,where='user',whereValue=value['user'])
    console.log(sql);
}


getFun({user:'ikun'})

module.exports = getFun