let table_name = "loan_user"

let firstInstSuccess = async (id, status, mysqlC, res) => {
    sql = `update ${table_name} set aduitStatus = ${status} where id = ${id};`
    let successObj
    if (status === '1') {
        successObj = {
            code:200,
            message:"一审通过"
        }
    }else if(status === '2'){
        successObj = {
            code:200,
            message:"二审通过"
        }
    }else if(status === '3'){
        successObj = {
            code:200,
            message:"终审通过"
        }
    }else if(status === '4'){
        successObj = {
            code:200,
            message:"驳货成功"
        }
    }

    await mysqlC.query(sql, (err, result) => {
        if (err) {
            res.send({
                code: 605,
                message: "数据库错误"
            })
        } else {
            res.send(successObj)
        }
    })

}

module.exports = firstInstSuccess