<template>
    <div class="dowebok">
        <p>很抱歉，您访问的页面找不到了...</p>
        <img src="./../assets/images/404.png" alt="">
        <a @click="goHome">返回首页</a>
    </div>
</template>
<script>
export default{
    name:'404',
    methods:{
        goHome(){
            this.$router.push('/welcome')
            
        }
    }
    
}
</script>
<style lang="scss">
* { 
    margin: 0; 
    padding: 0;
}

body {
    background-color: #fff;
}

.dowebok {
    position: absolute; 
    left: 50%; top: 50%; 
    margin: -300px 0 0 -340px; 
    text-align: center;
}
.dowebok p { 
    font-size: 20px; 
    color: #3c4349;
    font-weight:bold;
}
.dowebok img { 
    display: block; 
    margin: 50px auto;
}
.dowebok a { 
    display: block; 
    width: 190px; height: 71px; 
    margin: 0 auto; 
    padding-right: 15px; 
    line-height: 42px; 
    font-size: 20px; 
    color: #3e454b; 
    text-decoration: none; 
    background-image: url(./../assets/images/btn.png);
    cursor:pointer;
    font-weight:bold;
}
    
</style>