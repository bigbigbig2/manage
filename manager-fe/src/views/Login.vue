<script>
import { Avatar, Lock } from "@element-plus/icons-vue";
export default{
  name:'login',
  data(){
    return{
      user:{
        userName:'admin',
        userPwd:'admin'
      },
      //表单校验
      rules:{
        userName:[
          {
            required:true, 
            message:'请输入用户名',
            trigger:'blur'
          }
        ],
        userPwd:[
          {
            required:true, 
            message:'请输入密码',
            trigger:'blur'
          }
        ]
      }
    }
  },
  setup(){
    return {
      Avatar,
      Lock
    }
  },

  methods:{
    login(){
      this.$refs.userForm.validate((valid)=>{
        //点击登录时先校验是否输入用户名和密码
        
        if(valid){
          //方法一，直接使用封装好的request发送请求 
          // this.$request({
          //   url:'/users/login',
          //   method:'post',
          //   data:this.user,
          //   mock:false
          // }).then((res) =>{
          //   //登录成功后将返回的数据存储到vuex和localstorage中
          //   this.$store.commit('saveUserInfo',res);
          //   //登录成功后跳转到首页
          //   this.$router.push('/welcome');
          // })

          //方法二(推荐)：在api/index.js中集中管理
          //console.log(this.$store.state.userInfo)
          this.$api.login(this.user).then((res)=>{
            //console.log(res)
            this.$store.commit("saveUserInfo", res);
            this.$router.push("/welcome");
          })
        }else{
          return false;
        }
      })
    }
  }
}
</script>

<template>
  <div class= "login-wrapper">
    <!-- 登录框 -->
    <div class="modal">  
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input type="text" :prefix-icon="Avatar" v-model="user.userName"/>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" :prefix-icon="Lock" v-model="user.userPwd"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:#f9fcff ;
  width:100vw;
  height: 100vh;
  .modal{
    width: 500px;
    padding:50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title{
      font-size: 50px;
      line-height: 1.5;
      text-align:center;
      margin-bottom:30px;
    }
    .btn-login{
      width:100%;
    }
  }

}
</style>
