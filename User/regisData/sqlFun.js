/**
 * 数据库拼接函数
 * @param {String} table_name 
 * @param {String} type sql语句类型
 * @param {Array} columns 数据表名
 * @param {object} value 请求体获取的数据
 * @param {object} where 查询条件键值对 {id:1}
 * @returns 
 */
const sqlFun = function (table_name, type, columns, value, where = {}) {
    // 定义语句变量
    let sql
    let sqlstar
    let sqlend
    // 插入语句
    if (type === 'insert') {
        sqlstar = `insert into ${table_name} (`
        sqlend = `values(`
        columns.forEach((item, index) => {
            if (index === columns.length - 1) {
                sqlstar += `${item})`
                sqlend += `'${value[index]}')`
            } else {
                sqlstar += `${item},`
                sqlend += `'${value[index]}',`
            }
        })
        sql = sqlstar + ' ' + sqlend
    } else if (type === 'select') {
        // console.log(where);
        sqlstar = `select `
        columns === '*' 
        ? 
        sqlstar = `${sqlstar} * from ${table_name} ` 
        : 
        function () {
            columns.forEach((item, index) => {
                if (index === columns.length - 1) {
                    sqlstar += `${item} from ${table_name}`
                    return
                }
                sqlstar += `${item},`
            })
        }()
        // 条件语句添加
        where && Object.keys(where).length === 1
            ?
            sqlstar += ` where ${Object.keys(where)[0]} = '${where[Object.keys(where)[0]]}'`
            :
            (function () {
                sqlstar += ` where`
                let length = Object.keys(where).length
                for (let i = 0; i < length; i++) {
                    sqlstar += ` ${Object.keys(where)[i]} = '${where[Object.keys(where)[i]]}'`
                    if (i + 1 !== length) sqlstar += ` and `
                }
            })();
        sql = sqlstar
    } else if (type === 'update') {
        // 更新sql 预计组装
        sql = `${type} ${table_name} set `
        if (typeof columns == "string") {
            sql += `${columns} = '${value}'`
        } else {
            console.log("暂时先等下");
        }

        where && Object.keys(where).length > 0
            ?
            (function () {
                sql += ' where'
                sqlend = ''
                Object.keys(where).forEach((item, index) => {
                    if (index + 1 === Object.keys(where).length) {
                        sqlend += ' and'
                    }
                    sqlend += ` ${item} = '${where[item]}' `
                })
                sql += sqlend
            })()
            :
            sql += `where ${Object.keys(where)[0]} = '${where[Object.keys(where)[0]]}'`
    }
    return sql
}

module.exports = sqlFun