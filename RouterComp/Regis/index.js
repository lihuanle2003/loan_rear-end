const express = require("express");

const regis = require("../../User/regisData")

const regisRouter = express.Router()


regisRouter.post("/regisPut",(req,res)=>{
    regis.puts(req.query,res)
})
regisRouter.post("/getRegisData",(req,res)=>{
    regis.get(req.query,res)
})

regisRouter.post("/getRecordInfoByID",(req,res)=>{
    regis.getInfoDataById(req.query,res)
})


module.exports = regisRouter