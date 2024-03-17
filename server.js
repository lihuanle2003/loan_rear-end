const express = require("express");
const bodyParser = require("body-parser");

const jwt = require("./jwt/index.js");

const RouterComp = require("./RouterComp")

// 创建服务器
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/defalutPath",router)
app.use(RouterComp.applicRouter)                                                                                                                                                                                                                                                                                                                                                                                                                                                    
app.use(RouterComp.userRouter)
app.use(RouterComp.regisRouter)
app.use(RouterComp.loanRouter)

// 中间件解析请求头信息
app.use(express.json())

// 用户非退出 项目再次启动 token验证
app.post("/tokenVerfiy", (req, res) => {
    /**
     * res.set({'a':'b'}) 设置一个heade信息
     * res.setHeader({}) 设置多个header
     * res.status(200).send({...}) 设置状态码 设置响应体
     * res.end() 结束
     */
    jwt.verify(req, res)
})


// 开启服务器 监听
app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});