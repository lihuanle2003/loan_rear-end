const db = require(".")
const routesList = require("../routerGet/routeList")

/**
     * {数据插入sql语句拼装函数}
     * 
     *  */
const insertSqlFun = (insertSql, userKeys, userValues) => {
    // 定义sql语句的前半和后半
    let str1 = '', str2 = 'values('
    let arrIndex
    userKeys.map((item, index) => {
        arrIndex = index
        // 结尾拼接
        if (index + 1 === userKeys.length) {
            str1 += `${item})`
            str2 += `'${userValues[arrIndex]}')`
        } else {
            str1 += `${item},`
            // 没有值
            if (!userValues[arrIndex]) {
                str2 += `'',`
            }
            else if (item === 'sex') {
                let sex = userValues[arrIndex]
                str2 += `'${sex}',`
            } else if (item === 'birth') {
                let date = userValues[arrIndex].substring(0, 10)
                str2 += `'${date}',`
            } else {
                str2 += `'${userValues[arrIndex]}',`
            }
        }
    })
    return insertSql + str1 + str2
}


const  selectData = (sql, res) => {
    db.query(sql, (err, value) => {
        if (err) {
           res.send({
            code:605,
            message:"数据库失误"
           })
        } else {
            res.send({
                code:200,
                message:"请求成功",
                data:value,
                routesArr:routesList.componentArr
            })
        }
    })
}

module.exports = {
    insertSqlFun,
    selectData
}