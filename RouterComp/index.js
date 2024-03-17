const applicRouter = require("./Applic")
const userRouter = require("./user")
const regisRouter = require("./Regis")
const loanRouter = require("./Loan")


// 集中暴露
module.exports = {
    applicRouter,
    userRouter,
    regisRouter,
    loanRouter
}