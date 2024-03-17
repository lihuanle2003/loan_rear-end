const express = require("express");
const bodyParser = require("body-parser");
const db = require("./mysql/index.js");

const firstInstSuccess = require("./firstInst/index.js")
const User = require('./User/index.js');
const jwt = require("./jwt/index.js");
const sqlFunction = require("./mysql/sqlFun.js");

const updateUserLimit = require("./mysql/findUserLimit.js")
const regis = require("./User/regisData")

// 创建服务器
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 中间件解析请求头信息
app.use(express.json())

// 定义连接的数据库表
let table_name = "loan_user"
let sqlTableName = table_name

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


// 用户登录
app.post("/login", (req, res) => {
    // 登录的前端请求体用户数据 账号:username 密码:password
    const data = req.query
    User.findUser(data, req, res)
});

// 用户注册
app.post("/sign", (req, res) => {
    // 注册的前端请求体用户数据 账号:userName 密码:userPassword 二次密码:rePassword
    const data = req.body
    User.signUser(data, res)
});

// 用户退出登录
app.post("/user/logout", (req, res) => {
    // 修改在线状态
    sql = `update login_user set online = 0 where userName = '${req.query.userName}'`
    // console.log(sql);
    db.query(sql, (err, values) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                code: 603,
                message: "退出成功,token失效"
            })
        }
    })
})

// 拿到table数据 columns
app.get("/loan/getList", (req, res) => {
    db.query(sqlFun({
        tableName: sqlTableName,
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
app.post("/loan/updateData", (req, res) => {
    const data = req.body.params
    let columNames = Object.keys(data)
    let sql = `update ${sqlTableName} set `
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



// 明天接口内部业务过多的进行模块拆分 外加重要请求token验证

// 用户提交申请数据
let sqlFind = `show tables like '${table_name}'`
app.post("/user/submitLoanData", (req, res) => {
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
    let sql = `create table ${table_name} ( id INT AUTO_INCREMENT PRIMARY KEY, `
    let insertSql = `insert into ${table_name} (`


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


// 提交审核同意数据
app.post("/submit/firstSuccess", async (req, res) => {
    await firstInstSuccess(req.query.id, req.query.status, db, res)
})


app.post("/submit/firstNoargee", async (req, res) => {
    await firstInstSuccess(req.query.id, req.query.status, db, res)
})

// 用户非退出 项目再次启动 token验证
app.post("/tokenVerfiy", (req, res) => {
    jwt.verify(req, res)
})

// 拿到注册用户表数据
app.get("/login_user", (req, res) => {
    sql = "select * from login_user"
    sqlFunction.selectData(sql, res)
})

// 更改用户权限
app.post("/updateUserLimit", (req, res) => {
    let arr = req.query.needCopmonent
    let targetUser = req.query.userName
    updateUserLimit(arr,targetUser,res)
})

app.post("/getUserLimit",(req,res)=>{
    sql = `select limits from login_user where userName = '${req.query.userName}'`
    db.query(sql,(err,value)=>{
        if(err){
            console.log(err);
        }else{
            console.log(value[0]);
            res.send({
                code:200,
                message:"请求成功",
                limit:value[0]
            })
        }
    })
})

app.post("/regisPut",(req,res)=>{
    regis.puts(req.query,res)
})
app.get("/getRegisData",(req,res)=>{
    regis.get(req.query,res)
})

// 开启服务器 监听
app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});