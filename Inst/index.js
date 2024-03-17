
let Inst = async (id, status, mysqlC, res, table_name = 'loan_user') => {
    sql = `update ${table_name} set aduitStatus = ${status} where id = ${id};`
    let successObj
    let code = 200
    switch (status) {
        case '0':
            successObj = {
                code,
                message: '重新审核'
            }
            break;
        case '1':
            successObj = {
                code,
                message: '一审通过'
            }
            break;
        case '2':
            successObj = {
                code,
                message: '二审通过'
            }
            break;
        case '3':
            successObj = {
                code,
                message: '终审通过'
            }
            break;
        case '4':
            successObj = {
                code,
                message: '驳回成功'
            }
            break;
    }

    await mysqlC.query(sql, (err, result) => {
        if (err) {
            res.send({
                code: 605,
                message: "数据库错误"
            })
        } else {
            res.send(successObj);
        }
    })
}

module.exports = Inst;