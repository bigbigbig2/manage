//入口
//因为vuex在刷新之后数据会丢失，所以结合storage一起使用，实现持久存储
import {createStore} from 'vuex';
import mutations from './mutations';
import storage from './../utils/storage';

const state={
    userInfo: storage.getItem("userInfo") || {}, //获取用户信息
    menuList: storage.getItem("menuList") || [],
    actionList: storage.getItem("actionList") || [],
    noticeCount: 0
}
export default createStore({
    state,
    mutations
})