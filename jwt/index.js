// 引入jwt第三方库
const jwt = require('jsonwebtoken')
// 生成密钥
const secretkey = 'helloworld'

// 生成token
const sign = (data = {}) => {
    return jwt.sign(data, secretkey, {
        expiresIn: 60 * 60
    })
}

// 验证token
const verify = (req,res) => {
    // 拿到请求token字符串
    let authorization = req.headers.authorization || req.body.token || req.query.token || ''
    let token = '';
    // 拿到token
    if(authorization.includes("Bearer")){
        token = authorization.replace('Bearer ','');
    }else{
        token = authorization;
    }

    // 验证token
    jwt.verify(token,secretkey,(error,data)=>{
        // console.log("tokenverify",token);
        if(error){
            res.send({
                code:603,
                message:"token失效"
            })
        }else{
            res.send({
                code:200,
                message:"token验证成功"
            })
        }
    })
};

module.exports = {
    sign,
    verify
}