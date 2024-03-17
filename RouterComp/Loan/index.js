const express = require("express");
const db = require("../../mysql");
const sqlFunction = require("../../mysql/sqlFun.js");

const tableName = require('../../mysql/tableName.js')


const loanRouter = express.Router()
/**
 * @param {数据库操作参数对象} param 
 * 
 * @returns {返回数据库语句}
 */
const sqlFun = (param) => {
    let sql = null;
    if (param.type === "select" && param.msg === "all") {
        sql = `select * from ${param.tableName}`;
    }
    return sql;
}


// 拿到table数据 columns
loanRouter.get("/loan/getList", (req, res) => {
    db.query(sqlFun({
        tableName: tableName.sqlTableName,
        msg: "all",
        type: "select"
    }), (err, result) => {
        // console.log(result);
        if (err) {
            // 不存在
            return res.send({ code: 605, status: 0, message: "数据库不存在 或者 没有数据" })
        } else {
            // console.log(result);
            // 数据库存在数据
            if (result.length > 0) {
                res.send({
                    code: 200,
                    data: {
                        columns: Object.keys(result[0]),
                        tableData: result
                    },
                    status: 1
                })
            } else {
                res.send({
                    code: 605,
                    message: "没有数据"
                })
            }
        }
    })
})

// 编辑更新数据
loanRouter.post("/loan/updateData", (req, res) => {
    const data = req.body.params
    let columNames = Object.keys(data)
    let sql = `update ${tableName.sqlTableName} set `
    columNames.map((item, index) => {
        if (item === 'id') {
            return
        }
        let str
        if (index + 1 === columNames.length) {
            str = `${item} = '${data[item]}' where id = ${data.id};`
        } else if (item === "birth") {
            let rq = data[item].substring(0, 10)
            str = `${item} = '${rq}',`
        } else {
            str = `${item} = '${data[item]}',`
        }
        sql += str
    })
    try {
        db.query(sql, (err, result) => {
            if (err) {
                res.send({
                    code: 605,
                    message: "操作失误或者填入数据存在问题"
                })
            } else {
                res.send({
                    code: 200,
                    message: "更新数据成功"
                })
            }
        })
    } catch (e) {
        console.log("错误");
    }
})

// 用户提交申请数据
let sqlFind = `show tables like '${tableName.table_name}'`
loanRouter.post("/user/submitLoanData", (req, res) => {
    // 拆分数据
    const userInfoKeys = Object.keys(req.query.userInfo)
    const userInfoValues = Object.values(req.query.userInfo)

    const userWorkInfoKeys = Object.keys(req.query.userWorkInfo)
    const userWorkInfoValues = Object.values(req.query.userWorkInfo)

    // 重组数据 添加审核状态字段 初始为0 表示待审核
    const userKeys = [...userInfoKeys, ...userWorkInfoKeys]
    userKeys.push("aduitStatus")
    const userValues = [...userInfoValues, ...userWorkInfoValues]
    userValues.push(0)

    // 定义创建初始创建数据库语句和插入语句
    let sql = `create table ${tableName.table_name} ( id INT AUTO_INCREMENT PRIMARY KEY, `
    let insertSql = `insert into ${tableName.table_name} (`


    // 插入数据库语句生成
    insertSql = sqlFunction.insertSqlFun(insertSql, userKeys, userValues)

    // 数据库执行操作
    db.query(sqlFind, (err, results) => {
        if (err) {
            res.send({ code: 605, message: "服务器错误" })
        } else if (results.length > 0) {
            // 数据表存在 执行插入表操作
            db.query(insertSql, (err, result) => {
                if (err) {
                    res.send({
                        code: 605,
                        message: "服务器错误"
                    })
                } else {
                    res.send({
                        code: 200,
                        message: "操作成功"
                    })
                }
            })
        } else {
            // 数据表不存在 执行新增表操作 再执行插入表操作
            userKeys.map((item, index) => {
                if (item === 'birth') {
                    sql += `${item} DATE, `
                } else if (item === 'sex') {
                    sql += `${item} char, `
                } else if (item === 'idCardNum') {
                    sql += `${item} varchar(45) unique, `
                } else if (index + 1 === userKeys.length) {
                    // 最后元素
                    sql += `${item} varchar(45) )`
                } else {
                    sql += `${item} varchar(45),`
                }
            })
            db.query(sql, (err) => {
                if (err) {
                    res.send({
                        code: 605,
                        message: "服务器错误"
                    })
                } else {
                    // 执行插入数据
                    db.query(insertSql, (err, result) => {
                        if (err) {
                            res.send({
                                code: 605,
                                message: "服务器错误"
                            })
                        } else {
                            res.send({
                                code: 200,
                                message: "操作成功"
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = loanRouter