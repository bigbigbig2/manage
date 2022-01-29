<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd()">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="角色创建" v-model="showModal" width="600px">
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="权限设置" v-model="showPermission" width="600px">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus"; //按需引入，全局导入有毛病
import utils from "../utils/utils";
export default {
  name: "role",
  data() {
    return {
      roleList: [],
      queryForm: {
        roleName: "",
      },
      roleForm: {
        roleName: "",
        remark: "",
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              if (key) {
                names.push(this.actionMap[key]);
              }
            });
            return names.join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      pager: {
        pageSize: 10,
        total: 0,
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
          },
        ],
      },
      action: "",
      showModal: false,
      //权限设置弹框相关
      showPermission: false,
      curRoleId: "",
      curRoleName: "",
      menuList: [],
      //菜单映射表
      actionMap: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    //角色列表
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleList(this.queryForm);
        this.pager.total = page.total;
        this.roleList = list;
      } catch (e) {
        console.log(e);
      }
    },
    //设置权限里边获取菜单列表
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList();
        this.menuList = list;
        this.getActionMap(list);
      } catch (e) {
        throw new Error(e);
      }
    },
    //表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    //角色删除
    async handleDel(_id) {
      await this.$api.roleOpreate({ _id, action: "delete" });
      ElMessage.success("删除成功");
      this.getRoleList();
    },
    handleAdd() {
      this.action = "create";
      this.showModal = true;
    },
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        this.roleForm = row;
      });
      this.getRoleList();
    },
    //关闭弹窗
    handleClose() {
      this.showModal = false;
      //重置，清空表单编辑
      //那为什么在行内点击编辑后在点全局的创建表单内容不是空的？
      //这是组件内部的机制：会在打开表单的同时将数据初始化上去
      this.handleReset("dialogForm");
      this.getRoleList();
    },
    //提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm, action } = this;
          let params = { ...roleForm, action };
          let res = await this.$api.roleOpreate(params);
          if (res) {
            this.showModal = false;
            ElMessage.success("创建成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          }
        }
      });
    },
    handleCurrentChange() {},
    //点击设置权限按钮
    handleOpenPermission(row) {
      this.curRoleName = row.roleName;
      this.curRoleId = row._id;
      this.showPermission = true;
      let { checkedKeys } = row.permissionList;
      //通过句柄的方式调用elementPlus里el-tree的方法
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },
    //提交权限设置
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        //如果二级菜单下面有children，按钮是没有children的
        //将按钮和菜单完全的区分开来
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      //调用接口
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          //这里注意需要将一级猜的的checkkey和二级菜单的key和并起来发到服务端（根据接口文档）
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.showPermission = false;
      ElMessage.success("创建成功");
      this.getRoleList();
    },
    //递归遍历菜单列表，生成一个将最后一级菜单（按钮）的id和菜单名称的映射对象
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          //如果某个菜单有children字段和action字段,那么它的就是子菜单就是操作按钮了（根据接口文档）
          if (item.children && item.action) {
            //将这个菜单的id映射菜单名称并保存到actionMap里
            actionMap[item._id] = item.menuName;
          }
          //如果有children字段但是没有action字段,那么这个菜单不是按钮，只要有action的为按钮
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
  },
};
</script>

<style>
</style>