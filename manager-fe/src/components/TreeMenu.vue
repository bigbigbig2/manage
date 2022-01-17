<template>
  <template v-for="menu in userMenu">
    <el-sub-menu v-if="menu.children && menu.children.length>0 &&menu.children[0].menuType==1" :key="menu" :index="menu.path">
      <template #title>
          <el-icon >
            <setting v-if="menu.icon=='el-icon-setting'"/>
            <document v-else-if="menu.icon=='el-icon-s-promotion'" />
          </el-icon>
        <span>{{menu.menuName}}</span>
      </template>
      <!-- 递归调用 -->
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">{{menu.menuName}}</el-menu-item>
  </template>
  
</template>
<script>
//Menu图标是特例，需要定别名，因为原生就有<menu></menu>
import {Document,Setting} from '@element-plus/icons-vue'

export default {
  name: "TreeMenu",
  components:{Document,Setting},
  props: {
  userMenu: {
        type: Array,
        default() {
          return [];
        },
      },
  },
};
</script>