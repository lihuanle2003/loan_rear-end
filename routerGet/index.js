
/**
 * @param {Array} arr 
 * @param {Array.component} component 
 * @returns {number} 返回数组下标
 */
const findObjectIndex = (arr, component) => {
    return arr.findIndex(
        obj => obj.component === component
    )
}

// 拷贝对象
const copyObject = obj => {
    let newObj = {}
    let keys = Object.keys(obj)
    keys.forEach(item => {
        newObj[item] = obj[item]
    })

    if (newObj.children) {
        newObj.children = []
    }
    return newObj
}


// 判断children是否存在重复对象
const arrChildrenHasRepeat = (obj, item) => {
    let status = 0;
    obj.forEach(i => {
        // 存在重复元素 返回1
        if (i.component === item.component) {
            status = 1;
        }
    })
    return status
}


/**
 * @param {Array} data 遍历数组
 * @param {Array} arrNeed 需要的路由组件名
 * @param {Number | undefined} index 父路由下标
 * @returns {Array} 返回的新路由数组
 */
const routerArrFilter = (data, arrNeed, index = undefined,arr=[]) => {
    // 将arr作为参数传入 避免全局变量重复记录
    data.forEach((item) => {
        if (arrNeed.indexOf(item.component) !== -1) {
            if (index === undefined || index === -1) {
                let obj = copyObject(item)
                arr.push(obj)
            } else {
                // 数组 children去重
                if (arrChildrenHasRepeat(arr[index].children, item)) {
                    return
                } else {
                    // console.log(item);
                    arr[index].children.push(item)
                }
            }
        }
        // 存在children
        if (item.children) {
            // 递归
            routerArrFilter(item.children, arrNeed, index = findObjectIndex(arr, item.component),arr=arr)
        }
    })
    // 返回满足条件的对象数组
    return arr
}

module.exports = routerArrFilter
