/**
 * 数据库拼接函数
 * @param {String} table_name 
 * @param {String} type sql语句类型
 * @param {Array} columns 数据表名
 * @param {object} value 请求体获取的数据
 * @returns 
 */
const sqlFun = function (table_name, type, columns, value, where, whereValue) {
    let sql
    let sqlstar
    let sqlend
    if (type === 'insert') {
        sqlstar = `insert into ${table_name} (`
        sqlend = `values(`
        columns.forEach((item, index) => {
            if (index === columns.length - 1) {
                sqlstar += `${item})`
                sqlend += `'${value[item]}')`
            } else {
                sqlstar += `${item},`
                sqlend += `'${value[item]}',`
            }
        })
        sql = sqlstar + ' ' + sqlend
    } else if (type === 'select') {
        sqlstar = `select `
        columns === '*' ? sqlstar = `${sqlstar} * from ${table_name} ` : function () {
            columns.forEach((item, index) => {
                if (index === columns.length - 1) {
                    sqlstar += `${item} from ${table_name}`
                    return
                }
                sqlstar += `${item},`
            })
        }()
        where ? sqlstar += ` where ${where} = '${whereValue}'` : undefined
        sql = sqlstar
    }
    return sql
}
const value = {
    regis_code:"123",
    user:'ikun',
    submitDate:'2024-1-2'
}

let sql = sqlFun('regis', 'select', '*',value,where='user','ikun')

module.exports = sqlFun