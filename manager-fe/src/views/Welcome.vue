<script >
export default{
  name:'welcome'
}
</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">xxx企业后台管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<style lang="scss">
.welcome{
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  height: calc(100vh - 90px);
  background-color: #fff;
  .content{
    margin-bottom: 200px;
    .sub-title{
      font-size:30px;
      line-height: 42px;
      color:#333;
    }
    .title{
      font-size: 40px;
      line-height: 62px;
      color:#409eff;
    }
  }
  .img{
    background-image:url("./../assets/images/01.png") ;
    margin-left: 120px;
    width: 536px;
    height: 443px;
  }
  
}

</style>
