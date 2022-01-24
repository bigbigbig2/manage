<template>
  <div class="user-manage">
      <div class="query-form">
          <el-form ref="form" :inline="true" :model="queryForm">
              <el-form-item label="菜单名称" prop="menuName" >
                  <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
              </el-form-item>
              <el-form-item label="菜单状态" prop="menuState">
                  <el-select v-model="queryForm.menuState">
                      <el-option :value="1" label="正常"></el-option>
                      <el-option :value="2" label="停用"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type = "primary" @click="handleQuery">查询</el-button>
                  <el-button @click="handleReset('form')">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
      <div class="base-table">
            <div class="action" >
              <el-button type="primary" @click="handleAdd(1)">创建</el-button>
            </div>
            <el-table :data="menuList"
                row-key="_id"
                :tree-props="{children:'children'}"
            >
                  <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column 
                v-for="item in columns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
                >
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template #default="scope">
                        <el-button type="primary" @click="handleAdd(2,scope.row)"  size="mini">创建</el-button>
                        <el-button @click="handleEdit(scope.row)"  size="mini">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
      </div>
     <el-dialog title="菜单新增" v-model="showModal" width="600px">
          <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules">
              <el-form-item label="父级菜单" prop="userName">
                  <el-cascader
                    v-model="menuForm.parentId"
                    :options="menuList"
                    :props="{checkStrictly:true,value:'_id',label:'menuName'}"
                    clearable
                  />
                  <span>不选，则直接创建一级菜单</span>
              </el-form-item>
              <el-form-item label="菜单类型" prop="menuType">
                  <el-radio-group v-model="menuForm.menuType">
                      <el-radio :label="1">菜单</el-radio>
                      <el-radio :label="2">按钮</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="菜单名称" prop="menuName">
                  <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
              <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType==1">
                  <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"></el-input>
              </el-form-item>
              <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType==1">
                  <el-input v-model="menuForm.path" placeholder="请输入路由地址"></el-input>
              </el-form-item>
              <el-form-item label="权限标识" prop="menuCode " v-show="menuForm.menuType==2">
                  <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"></el-input>
              </el-form-item>
              <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType==1">
                  <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
              </el-form-item>
              <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType==1">
                  <el-radio-group v-model="menuForm.menuState">
                      <el-radio :label="1">正常</el-radio>
                      <el-radio :label="2">停用</el-radio>
                  </el-radio-group>
              </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit" >确定</el-button>
            </span>
        </template>
      </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus' //按需引入，全局导入有毛病
import utils from "../utils/utils";
export default {
    name:'user',
    data(){
        return {
            menuList:[] ,
            queryForm:{
                menuState:1 //向数据库发出查询
            },
            columns:[
                {
                    label:'菜单名称',
                    prop:'menuName',
                },
                {
                    label:'图标',
                    prop:'icon',
                },
                {
                    label:'菜单类型',
                    prop:'menuType',
                    formatter(row,column,value){
                        return { 
                            1:'菜单',
                            2:'按钮'
                        }[value]
                    }
                    
                },
                {
                    label:'权限标识',
                    prop:'menuCode'
                },
                {
                    label:'路由地址',
                    prop:'path'
                },
                {
                    label:'组件路径',
                    prop:'component'
                },
                {
                    label:'菜单状态',
                    prop:'menuState',
                    formatter(row,column,value){
                        return { 
                            1:'正常',
                            2:'停用'
                        }[value]
                    }
                    
                },
                {
                    label:'创建时间',
                    prop:'createTime',
                    formatter(row,column,value){
                        return utils.formateDate(new Date(value))
                    }
                }
            ],
            showModal:false,
            menuForm:{
                parentId:[null],
                menuType:1,
                menuState:1
            },
            action:'',
            rules:{
                menuName:[
                    {
                        required:true,
                        message:'请输入菜单名称',
                        trigger:'blur'
                    },
                    {
                        min:2,
                        max:10,
                        message:'允许长度为2-个字符',
                        trigger:'blur'
                    }
                ]
            },
        }
    },
    mounted(){
        //菜单列表初始化
        this.getMenuList();
    },
    methods: {
        async getMenuList(){
            let list = await this.$api.getMenuList(this.queryForm);
            this.menuList = list;
        },
        handleQuery(){
            this.getMenuList();
        },
        handleReset(form){
            this.$refs[form].resetFields();
        },
        handleAdd(type,row){
            this.showModal = true; //新增弹框
            this.action = 'add';
            //type：1是顶部的新增，2是行内的新增(行内的创建其父级菜单则为选好了的)
            if(type == 2){
                this.menuForm.parentId = [...row.parentId,row._id].filter((item) => item);
            }
        },
        handleEdit(row){
            this.showModal = true;
            this.action = 'edit';
            this.menuForm = row;
            //清空表单
            this.$nextTick((row)=>{
                // this.menuForm = row;
                Object.assign(this.menuForm,row)
            });
        },
        async handleDel(_id){
            await this.$api.menuSubmit({_id,action:'delete'});
            ElMessage.success('删除成功');
            this.getMenuList()
        },
        handleSubmit(){
            this.$refs.dialogForm.validate(async (valid)=>{
                if(valid){
                    let {action} = this;
                    let params = {...this.menuForm,action}
                    let res = await this.$api.menuSubmit(params);
                    this.showModal = false;
                    ElMessage.success('操作成功');
                    this.handleReset('dialogForm');
                    this.getMenuList();
                }
            })
        },
        handleClose(){
            this.showModal = false;
            //重置，清空表单编辑
            //那为什么在行内点击编辑后在点全局的创建表单内容不是空的？
            //这是组件内部的机制：会在打开表单的同时将数据初始化上去
            this.handleReset('dialogForm');
        },

    },
        
}
</script>

<style>
</style>