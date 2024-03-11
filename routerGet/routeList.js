let componentArr = ["Home", "Main", "Loan", "AllowInst", "Berejected", "Finalinstance", "SecondInstance", "FirstInstance", "ApplicationManage", "LimitsOfauth/index"]
// 页面路由数组
let routerArrAll = [
    {
        path: "/home",
        component: "Home",
        children: [
            {
                path: '/home',
                name: "home",
                component: "Main",
                icon: "menu",
                title: "首页展示"
            }, {
                path: "/ApplicationManage",
                name: "ApplicationManage",
                icon: "s-flag",
                title: "贷款申请处理",
                component: "ApplicationManage"
            }, {
                path: '/FirstInstance',
                name: 'FirstInstance',
                component: "FirstInstance",
                icon: "loading",
                title: "一审环节",

            }, {
                path: "/SecondInstance",
                name: "SecondInstance",
                component: "SecondInstance",
                icon: "magic-stick",
                title: "二审环节",
            }, {
                path: "/Finalinstance",
                name: "Finalinstance",
                component: "Finalinstance",
                icon: "news",
                title: "终审环节"
            }, {
                path: "/Berejected",
                name: "Berejected",
                component: "Berejected",
                icon: "circle-close",
                title: "驳回数据"
            }, {
                path: "/AllowInst",
                name: "AllowInst",
                component: "AllowInst",
                icon: "circle-check",
                title: "最终过审人员"
            }, {
                path: "/loan",
                name: "loan",
                icon: "s-flag",
                title: "贷款申请",
                component: "Loan"
            }, {
                path: "/Limitofauth",
                name: "Limitofauth",
                icon: "user",
                title: "权限管理",
                component: "LimitsOfauth/index"
            }
        ]
    },
]

module.exports={
    componentArr,
    routerArrAll
}