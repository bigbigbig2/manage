//入口
import {createStore} from 'vuex';
import mutations from './mutations';
//因为vuex在刷新之后数据会丢失，所以结合storage一起使用，实现持久存储
import storage from './../utils/storage';

const state={
    userInfo:'' || storage.getItem("userInfo") //获取用户信息
}
export default createStore({
    state,
    mutations
})