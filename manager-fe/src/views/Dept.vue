<template>
  <div class="dept-manage">
    <!-- 查询表单 -->
    <div class="query-form">
      <el-form ref="queryform" :inline="true" :model="queryForm">
        <el-form-item label="部门名称">
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList" >查询</el-button>
          <el-button @click="handleReset('queryForm')" >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate()">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id" :tree-props="{children:'children'}" stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title ="action =='create'?'创建部门':'编辑部门'" v-model="showModel" >

    
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dept",
  data() {
    return {
      queryForm:{
        deptName:''
      },
      columns:[
        {
          label:'部门名称',
          prop:'deptName',
        },
        {
          label:'负责人',
          prop:'userName',
        },
        {
          label:'更新时间',
          prop:'updateTime'
        },
        {
          label:'创建时间',
          prop:'createTime'
        }
      ],
      deptList:[],
      pager:{
        pageNum:1,
        pageSize:10
      },
      action:'create',
      showModal:false
    };
  },
  mounted() {
    this.getDeptList();
  },
  methods: {
    async getDeptList(){
      let list = await this.$api.getDeptList();
      this.deptList = list;
    },
    //实现表单重置功能
    handleReset(form){
      this.$refs[form].resetFields();
    },
    //创建部门
    handleCreate(){
      this.action = 'create'
      this.showModal = true
    },
    //删除部门
    handleDel(_id){
      this.action = 'delete'
      this.showModal = true
    },
    //部门编辑
    handleEdit(form){
      this.action = 'edit'
      this.showModal = true
    }
  }
};
</script> 
