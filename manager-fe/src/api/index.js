// api管理
import request from './../utils/request'

export default{
    login(params){
        return request({
            url:'/user/login',
            method:'post',
            data:params,
        })

    },
    noticeCount(){ //请求的是通知数量
        return request({
            url:'/leave/count',
            method:'get',
            data:{},
            mock:true
        })
    },
    getMenuList(params){
        return request({
            url:'/menu/list',
            method:'get',
            data:params,
            mock:false

        })
    },
    getUserList(params){
        return request({
            url:'/users/list',
            method:'get',
            data:params,
            mock:false
        })
    },
    userDel(params){
        return request({
            url:'/users/delete',
            method:'post',
            data:params,
            mock:false
        })
    },
    //拉取所有的角色列表
    getRoleAllList(){
        return request({
            url:'/roles/allList',
            method:'get',
            data:{},
            mock:true
        })
    },
    getRoleList(params){
        return request({
            url:'/roles/list',
            method:'get',
            data:params,
            mock:true
        })
    },
    getDeptList(){
        return request({
            url:'/dept/list',
            method:'get',
            data:{},
            mock:true
        })
    },
    userSubmit(params){
        return request({
            url:'/users/operate',
            method:'post',
            data:params,
            mock:false
        })
    },
    menuSubmit(params){
        return request({
            url:'menu/operate',
            method:'post',
            data:params,
            mock:false
        })
    },
    //角色的创建，编辑，删除
    roleOpreate(params){
        return request({
            url:'/roles/operate',
            method:'post',
            data:params,
            mock:true
        })
    },
    //权限设置提交接口
    updatePermission(params) {
        return request({
            url:'/roles/update/permission',
            method:'post',
            data:params,
            mock:true
        })
    }
}