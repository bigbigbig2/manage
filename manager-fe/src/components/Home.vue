<script >
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";
// 一个用户图像+密码锁图标
import { Bell, Fold, Expand } from "@element-plus/icons-vue";

export default {
  name: "home",
  components: { TreeMenu, Bell, Fold, BreadCrumb, Expand },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      userMenu: [],
      noticeCount: 0,
      activeMenu: location.hash.slice(1), //获取当前页面url地址来渲染到到当前点击的menu
    };
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    //退出当前账号
    handleLogout(key) {
      if (key == "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("/login");
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount(); //接口返回的通知数量值
        this.noticeCount = count;
      } catch (error) {
        console.error(error);
      }
    },
    //获取菜单列表
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList();
        this.userMenu = list;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
};
</script>

<template>
  <div class="basic-layout">
    <!-- 左边导航菜单 -->
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo11.png" />
        <span>SINCERE</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#fffff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <!-- 右边内容块 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon>
              <expand v-if="isCollapse" style="cursor: pointer" />
              <fold v-else style="cursor: pointer" />
            </el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <!-- 图标有信息时的小红点 -->
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <!-- <i class="el-icon--right"></i> -->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #304156;
    color: #fff;
    overflow-y: auto; //设置滚动条
    transition: width 0.5s; //设置左侧导航栏向左收起时的动画
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
      overflow: hidden;
      transition: 0.7s;
      .logo {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 18px;
        height: 50px;
        img {
          margin-top: 9px;
          // margin-right: 1px;
          width: 38px;
          height: 32px;
        }
        span {
          display: none;
        }
      }
    }
    // 展开
    &.unfold {
      width: 200px;
      overflow: hidden;
      transition: 0.7s;
      .logo {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 18px;
        height: 50px;
        img {
          margin-top: 9px;
          // margin-right: 1px;
          width: 38px;
          height: 32px;
        }
        span {
          margin-top: 15px;
        }
      }
    }
  }
  .content-right {
    margin-left: 200px; //左侧固定，右侧自适应
    // 合并
    &.fold {
      margin-left: 64px;
      transition: 0.7s;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
      transition: 0.7s;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between; //文位于两边
      border-bottom: 1px solid #ddd; //便于与下边content区分开赖
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      // height: calc(100vh - 50px);
      height: 100%;
      .main-page {
        background: #fff;
        height: 100%;
        // height: calc(100vh - 50px);
      }
    }
  }
}
</style>
