/**
 * 
 * @param {String} type 消息类型 sqlConErr | successCon
 * @param {String} message 消息内容
 * @returns 
 */
const Msg = function(type,message){
    const msgObj = {}
    switch(type){
        case 'sqlConErr':
            msgObj["code"] = 605
            msgObj["message"] = message
            break;
        case 'successCon':
            msgObj['code'] = 200
            msgObj['message'] = message
            break;
        default:
            msgObj["message"] = '错误'
    }

    return msgObj
}

module.exports = Msg