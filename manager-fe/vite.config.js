import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  //vite服务器配置项,可根据vite官方文档来查询相关配置
  server:{
    host:'localhost',
    port:8080,
    //配置代理
    proxy:{
      "/api":{
        target:"http://localhost:3000",
        changeOrigin: true,
      },
    }
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  plugins: [vue()],
})
