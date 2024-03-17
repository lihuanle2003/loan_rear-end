const db = require("../mysql")
const routerArrFilter = require("../routerGet/index")
const routesList = require("../routerGet/routeList")

let componentArr = routesList.componentArr
let routerArrAll = routesList.routerArrAll

// 暂时无用
const getNeedRouteComponent = (arr) => {
    let newArr = componentArr.filter(item => {
        // 需要的路由
        if (arr.indexOf(item) === -1) {
            return item
        }
    })
    console.log(newArr);
    return newArr
}

// 暂时无用
const getNoNeedArr = (limit) => {
    if (limit === '1') {
        // return ['Loan']
        return []
    } else if (limit === '5') {
        return ["AllowInst", "Berejected", "Finalinstance", "SecondInstance", "FirstInstance", "ApplicationManage", "LimitsOfauth/index"]
    }
}

/**
 * 
 * @param {String} limit 用户的权限等级
 * @returns 相应权限的路由数组
 */
const getDataByLimit = async (name, limit) => {
    // arr = routerArrFilter(routerArrAll, componentArr.filter(item => item !== "Loan"), index = undefined, arr = [])
    // 通过权限等级获取需要的路由 
    // let noNeedArr = getNoNeedArr(limit)
    // arr = routerArrFilter(routerArrAll, getNeedRouteComponent(noNeedArr), index = undefined, arr = [])

    
    // 根据数据库存放的信息获取需要的路由
    let needArr
    const query = () => {
        let sql = `select allowComponent from login_user where userName = "${name}"`
        return promise = new Promise((resolve, reject) => {
            db.query(sql, (err, value) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(value[0])
                }
            })
        })
    }
    await query().then(value => {
        needArr = value.allowComponent.split(',')
        if(needArr.indexOf('Home') === -1) needArr.unshift("Home")

        //拿到权限允许的路由列表 
        arr = routerArrFilter(routerArrAll, needArr, index = undefined, arr = [])
    })

    // 拿到需要等待路由数组
    // console.log(arr);
    return {
        routerArr: arr.filter((item, index) => arr.findIndex(i => i.component === item.component) === index)
    }
}

module.exports = getDataByLimit