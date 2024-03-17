const express = require("express");
const db = require("../../mysql");
const Inst = require("../../Inst/index.js")

const applicRouter = express.Router()

// 提交审核同意数据
applicRouter.post("/submit/firstSuccess", async (req, res) => {
    let sql =  `update regis set isread = '1' where idCardNum = '${req.query.idCardNum}' and sex = '${req.query.sex}'`
    db.query(sql,(err,value)=>{
        if(err) console.log(err);
    })
    await Inst(req.query.id, req.query.status, db, res)
})

// 驳回
applicRouter.post("/submit/firstNoargee", async ({ query }, res) => {
    // 修改数据备注信息
    let sql = `update regis set message_info = '${query.message}' where idCardNum='${query.idCardNum}' and sex = '${query.sex}'`
    // 修改数据
    db.query(sql, (err, value) => {
        if (err) console.log(err);
    })
    // 修改loan_user数据状态
    await Inst(query.id, query.status, db, res);
})


module.exports = applicRouter