// api管理
import request from './../utils/request'

export default{
    login(params){
        return request({
            url:'/users/login',
            method:'post',
            data: params,
            mock: false
        })

    },
    noticeCount(params){ //请求的是通知数量
        return request({
            url:'/leave/count',
            method:'get',
            data:params,
            mock:false
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
    gerPermissionList(){
        return request({
            url:'/users/getPermissionList',  
            method:'get',
            data:{},
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
    //获取用户名称，id，邮箱
    getAllUserList(){
        return request({
            url:'/users/all/list',
            method:'get',
            data:{},
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
            mock:false
        })
    },
    getRoleList(params){
        return request({
            url:'/roles/list',
            method:'get',
            data:params,
            mock:false
        })
    },
    getDeptList(params){
        return request({
            url:'/dept/list',
            method:'get',
            data:params,
            mock:false
        })
    },
    deptOpreate(params) {
        return request({
            url: '/dept/operate',
            method: 'post',
            data: params,
            mock:false
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
            mock:false
        })
    },
    //权限设置提交接口
    updatePermission(params) {
        return request({
            url:'/roles/update/permission',
            method:'post',
            data:params,
            mock:false
        })
    },
    getApplayList(params) {
        return request({
            url: 'leave/list', 
            method: 'get',
            data: params,
            mock:false
        })
    },
    leaveOperate(params) {
        return request({
            url: '/leave/operate', 
            method: 'post',
            data: params,
            mock:false
        })
    },
    leaveApprove(params) {
        return request({
            url: '/leave/approve', 
            method: 'post',
            data: params,
            mock:false
        })
    }

}