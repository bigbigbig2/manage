//storage二次封装
//主要实现功能：命名空间，序列化和反序列化
import config from "../config";
export default{
    setItem(key,val){
        let storage = this.getStorage();
        //注意这里不能写成storage.key = val，这样写的话，可以就是字符串形式
        //而下面这种写法的话key则为变量形式
        storage[key] = val;
        //反序列化
        window.localStorage.setItem(config.namespace,JSON.stringify(storage));
    },
    getItem(key){
        return this.getStorage()[key]
    },
    getStorage(){
        //获取并将json对象转为js对象
        return JSON.parse(window.localStorage.getItem(config.namespace) || "{}");
    },
    
    clearItem(key){
        let storage = this.getStorage();
        delete storage[key]
        window.localStorage.setItem(config.namespace,JSON.stringify(storage));
    },

    clearAll(){
        window.localStorage.clear()
    }

}