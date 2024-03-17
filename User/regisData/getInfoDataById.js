const db = require("../../mysql")
const sqlFun = require("./sqlFun")
const Msg = require("../../msg")

// 请求获取身份证id对应的申请信息，并更改申请激励的状态
function getInfoDataById(query, res) {
    // 提取都需要的where条件
    // 获取loan_user信息的语句
    sql = sqlFun('loan_user', 'select', '*', null, query)

    sql2 = sqlFun('regis', 'update', 'isread', '0', query)

    sql3 = sqlFun('regis', 'select' , ["message_info"],null,query)
    db.query(sql, (err, value) => {
        let data = value
        if (err) {
            console.log(err);
            res.send(Msg("sqlConErr", "数据库连接错误"))
        } else {
            db.query(sql2, (err) => {
                if (err) {
                    console.log(err);
                    res.send(Msg("sqlConErr", "数据库连接错误"))
                }
                else {
                    db.query(sql3,(err,value)=>{
                        console.log(data);
                        console.log(value);
                        if(err) console.log(err);
                        else{
                            res.send({
                                code: 200,
                                data,
                                messageInfo:value
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = getInfoDataById
