const md5 = require("md5")

/**
 * 
 * @param {Object} inputUser 用户输入的数据
 * @param {Object} value 数据库查询的用户数据
 * @returns {} 验证状态以及权限标识
 */
const check = (inputUser,value)=>{
    // 将数据库查询到的用户信息拿到，进行判断操作
    let {userName,userPasword,limit} = value
    let status = false
    // console.log("userName",userName);
    // console.log(inputUser);
    if(userName === inputUser.userName && md5(inputUser.userPasword) === userPasword){
        // 账号密码验证成功
        status = true
    }

    return {
        status,
        limit
    }
}

module.exports=check