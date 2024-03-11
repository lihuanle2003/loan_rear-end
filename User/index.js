const db = require("../mysql/index")
const md5 = require("md5")
const jtw = require("../jwt/index.js")
const check = require("./checkUserPassw.js")
const getDataByLimit = require("./getDataByLimit.js")

// 插入数据库函数
// const sqlFun = (userName, userPassword, status) => {
//     let insertUser = `insert into login_user (userName,userPasword,status) values('${userName}','${md5(userPassword)}','${status}')`
//     return insertUser
// }

const sqlFun = (method, valueObj = {}) => {
    let sql
    if (method === 'insert') {
        sql = `insert into login_user (userName,userPasword,status,signTime,allowComponent) 
        values('${valueObj.userName}','${md5(valueObj.userPassword)}','${valueObj.status}','${valueObj.signTime}','${valueObj.allowComponent}')`;

    } else if (method === 'update') {
        // 
    }

    return sql
}

// login接口执行函数 
const findUser = (data, req, res) => {
    // 查询是否存在该用户
    sql = `select * from login_user where userName = '${data.username}'`

    db.query(sql,async (error, value) => {
        if (error) {
            res.send({
                code: 500,
                message: "数据库错误"
            })
        } else {
            // 用户信息不存在
            if (value.length == 0) {
                res.send({
                    code: 607,
                    message: "用户信息不存在"
                })
            } else {
                // 用户信息存在  账号密码确定完毕后 执行json web token 规范

                // 验证对象
                let isRight = check({
                    userName: data.username,
                    userPasword: data.password
                }, value[0])

                // 检测请求数据是否存在token信息 存在就不用再次生成token
                let authorization = req.headers.authorization || req.body.token || req.query.token || ''
                // token
                let token = authorization === '' ? jtw.sign({ userName: data.username }) : null

                // 验证身份信息 权限校验
                if (isRight.status) {
                    // 更新登录时间 sql语句
                    updateLoginTimeSql = `update login_user set lastLoginTime = '${data.loginTime}',online = 1 where userName = '${data.username}'`
                    // 更新lastLoginTime字段
                    db.query(updateLoginTimeSql, (err, value) => {
                        if (err) {
                            console.log(err);
                        }
                    })

                    // 拿到路由数据
                    // let resultObj = getDataByLimit(isRight.limit) // 根据权限等级获取
                    let resultObj = await getDataByLimit(data.username,isRight.limit)
                    // console.log("resultObj",resultObj);
                    return res.send(
                        {
                            code: 200,
                            message: "请求成功",
                            // 数组第一层去重
                            routerArr: resultObj.routerArr,
                            token
                        },
                    )
                }
                else {
                    return res.send({
                        code: 500,
                        message: "账号或密码错误",
                    })
                }
            }
        }
    })
}

const defaultRoutes = "Home,Main,Loan"
// sign接口执行函数
const signUser = (data, res) => {
    sql = `select * from login_user where userName = '${data.username}'`
    db.query(sql, (error, value) => {
        if (error) {
            res.send({
                code: 603,
                message: "数据库错误"
            })
        } else {
            // 查询没结果 表示没用户数据
            if (value.length === 0) {
                // console.log(value.length);
                // 没有存在用户数据
                let sql2 = sqlFun('insert',
                    {
                        userName: data.username,
                        userPassword: data.password,
                        status: 1,
                        signTime:data.signTime,
                        allowComponent:defaultRoutes
                    })
                // console.log(sql2);
                db.query(sql2, (error) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            code: 605,
                            message: "数据库错误"
                        })
                    } else {
                        res.send({
                            code: 200,
                            message: '注册成功'
                        })
                    }
                })
                // 存在用户数据
            } else {
                res.send({
                    code: 607,
                    message: "用户信息已存在"
                })
            }
        }
    })
}


module.exports = {
    findUser,
    signUser
}