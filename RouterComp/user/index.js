const express = require("express");
const db = require("../../mysql");
const sqlFunction = require("../../mysql/sqlFun.js");
const User = require("../../User")
const updateUserLimit = require("../../mysql/findUserLimit.js")


const userRouter = express.Router()

// 用户登录
userRouter.post("/login", (req, res) => {
    // 登录的前端请求体用户数据 账号:username 密码:password
    const data = req.query
    User.findUser(data, req, res)
});

// 用户注册
userRouter.post("/sign", (req, res) => {
    // 注册的前端请求体用户数据 账号:userName 密码:userPassword 二次密码:rePassword
    const data = req.body
    User.signUser(data, res)
});

// 用户退出登录
userRouter.post("/user/logout", (req, res) => {
    // 修改在线状态
    sql = `update login_user set online = 0 where userName = '${req.query.userName}'`
    // console.log(sql);
    db.query(sql, (err, values) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                code: 603,
                message: "退出成功"
            })
        }
    })
})

// 拿到注册用户表数据
userRouter.get("/login_user", (req, res) => {
    sql = "select * from login_user"
    sqlFunction.selectData(sql, res)
})

// 更改用户权限
userRouter.post("/updateUserLimit", (req, res) => {
    let arr = req.query.needCopmonent
    let targetUser = req.query.userName
    updateUserLimit(arr,targetUser,res)
})

userRouter.post("/getUserLimit",(req,res)=>{
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


module.exports = userRouter