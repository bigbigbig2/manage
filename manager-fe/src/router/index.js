import { createRouter,createWebHashHistory} from 'vue-router';
import Home from '@/components/Home.vue';
import request from './../utils/request'

const routes=[
    {
        name:'home',
        path:'/',
        meta:{
            title:"首页"
        },
        component:Home,
        redirect:'/welcome',//重定向到某个子路由
        children:[
            {
                name:'welcome',
                path:'/welcome',
                meta:{
                    title:'欢迎页'
                },
                component:()=>import('@/views/Welcome.vue'),
            },
            {
                name:'user',
                path:'/system/user',
                meta:{
                    title:'用户管理'
                },
                component:()=>import('@/views/User.vue')
            },
            {
                name:'menu',
                path:'/system/menu',
                meta:{
                    title:'菜单管理'
                },
                component:()=>import('@/views/Menu.vue')
            },
            {
                name:'role',
                path:'/system/role',
                meta:{
                    title:'角色列表'
                },
                component:()=>import('@/views/Role.vue')
            },
            {
                name:'dept',
                path:'/system/dept',
                meta:{
                    title:'部门管理'
                },
                component:()=>import('@/views/Dept.vue')
            },
            {
                name:'leave',
                path:'/audit/leave',
                meta:{
                    title:'休假申请'
                },
                component:()=>import('@/views/Leave.vue')
            },
            {
                name:'approve',
                path:'/audit/approve',
                meta:{
                    title:'待审批'
                },
                component:()=>import('@/views/Approve.vue')
            },


        ]

    },
    {
        name:'login',
        path:'/login',
        meta:{
            title:'登录'
        },
        component:()=>import('@/views/Login.vue')
    },
    {
        name:'404',
        path:"/:pathMatch(.*)*",
        meta:{
            title:'404页面'
        },
        component:()=>import('@/views/404.vue')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    if(to.meta.title){
        document.title = to.meta.title
    }
    next()  
})


export default router;