// 此处添加权限控制页面
let componentArr = ["Home", "Main", "Loan", "AllowInst", "Berejected", "Finalinstance", "SecondInstance", "FirstInstance", "ApplicationManage", "LimitsOfauth/index","Applic_record/Applic_record"]
// 页面路由数组 再此添加
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
            },{
                path:"/Applic_record",
                name:"Applic_record",
                icon:"s-order",
                title:"申请记录",
                component:"Applic_record/Applic_record"
            }
        ]
    },
]

module.exports={
    componentArr,
    routerArrAll
}