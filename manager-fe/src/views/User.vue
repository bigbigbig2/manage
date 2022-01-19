<template>
  <div class="user-manage">
      <div class="query-form">
          <el-form ref="form" :inline="true" :model="user">
              <el-form-item label="用户ID" prop="userId" >
                  <el-input v-model="user.userId" placeholder="请输入用户ID" />
              </el-form-item>
              <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="user.userName" placeholder="请输入用户名称" />
              </el-form-item>
              <el-form-item label="状态" prop="state">
                  <el-select v-model="user.state">
                      <el-option :value="0" label="所有"></el-option>
                      <el-option :value="1" label="在职"></el-option>
                      <el-option :value="2" label="离职"></el-option>
                      <el-option :value="3" label="试用期"></el-option>
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
              <el-button type="primary" @click="handleCreate">新增</el-button>
              <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
              <el-table :data="userList" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column 
                    v-for="item in columns"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :formatter="item.formatter"
                    >
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                      <template #default="scope">
                          <el-button @click="handleEdit(scope.row)"  size="mini">编辑</el-button>
                          <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <el-pagination 
                class="pagination"
                background 
                layout="prev, pager, next" 
                :total="paper.total" 
                :page-size="paper.pageSize"
                @current-change="handleCurrentChange"
              />
                
          </div>
      </div>
      <el-dialog title="用户新增" v-model="showModal" width="600px">
          <el-form ref="dialogForm" :model="userForm" label-width="100px" :rules="rules">
              <el-form-item label="用户名" prop="userName">
                  <el-input v-model="userForm.userName" :disabled="action == 'edit'" placeholder="请输入用户名称"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="userForm.userEmail" :disabled="action == 'edit'" placeholder="请输入用户邮箱">
                      <template #append>@outlook.com</template>
                  </el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="userForm.mobile" placeholder="请输入用户手机号"></el-input>
                </el-form-item>
              <el-form-item label="岗位" prop="job">
                  <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="state">
                  <el-select v-model="userForm.state">
                      <el-option :value="1" label="在职"></el-option>
                      <el-option :value="2" label="离职"></el-option>
                      <el-option :value="3" label="试用期"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="系统角色" prop="roleList" >
                  <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width: 100%;">
                      <el-option
                        v-for="role in roleList"
                        :label="role.roleName"
                        :value="role._id"
                      ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="所属部门" prop="deptId">
                  <el-cascader 
                    v-model="userForm.deptId"
                    placeholder="请选择所属部门"
                    :options="deptList" 
                    :props="{ checkStrictly:true,value:'_id',label:'deptName'}" 
                    clearable 
                    style="width: 100%;"
                  />
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
import { getCurrentInstance,onMounted,ref,reactive,toRaw} from "vue"
import { ElMessage } from 'element-plus' //按需引入，全局导入有毛病
import utils from "../utils/utils";
export default {
    name:'user',
    setup(){
        //获取composition api上下文对象
        const {proxy } = getCurrentInstance();
        //初始化用户表单对象
        const user = reactive({
            state:0
        })
        //初始化用户列表数据 
        const userList = ref([]);

        //初始化分页对象
        const paper = reactive({
            pageNum:1,
            pageSize:10,
            total:1
        });
        
        //选中用户列表的对象
        const checkedUserIds = ref([]);
        
        //定义表格的格式
        const columns = reactive([
            {
                label:'用户名',
                prop:'userName'
            },
            {
                label:'用户邮箱',
                prop:'userEmail'
            },
            {
                label:'用户ID',
                prop:'userId'
            },
            {
                label:'用户角色',
                prop:'role',
                formatter(row,column,value){
                    return {
                        0:'管理员',
                        1:'普通用户'
                    }[value]
                }
            },
            {
                label:'用户状态',
                prop:'state',
                formatter(row,column,value){
                    return {
                        1:'在职',
                        2:'离职',
                        3:'试用期'
                    }[value]
                }
            },
            {
                label:'注册时间',
                prop:'createTime',
                width:'190',
                formatter:(row,column,value)=>{
                    return utils.formateDate(new Date(value))
                }
            },
            {
                label:'最后登录时间',
                prop:'lastLoginTime',
                width:190,
                formatter:(row,column,value)=>{
                    return utils.formateDate(new Date(value))
                }
            },
        ])
        
        //弹框显示对象
        const showModal =ref(false)
        
        //点击新增用户时的用户信息对象
        const userForm = reactive({
            state:3
        })
        
        //定义（用户新增）表单校验规则
        const rules = reactive({
            //可对某个表单编写多个校验规则
            userName:[
                {
                    required:true,
                    message:'请输入用户名称',
                    trigger:'blur' //光标不在时校验
                },
            ],
            userEmail:[
                {
                    required:true,
                    message:'请输入用户邮箱',
                    trigger:'blur'
                }
            ],
            deptId:[
                {
                    required:true,
                    message:'请选择所属部门',
                    trigger:'blur'
                }
            ],
            mobile:[
                {
                    pattern:/1\d{10}/,
                    message:'请输入正确手机号格式',
                    trigger:'blur'
                }
                
            ]
        })

        //所有的角色列表
        const roleList = ref([]);
        //所有部门列表
        const deptList = ref([]);
        //定义用户操作的行为
        const action = ref('add');

        onMounted(()=>{
            getUserList();
            getDeptList();
            getRoleList();
        })
        //获取用户列表
        const getUserList = async ()=>{
            let params = {...user,...paper};
            try{
                const {list,page} = await proxy.$api.getUserList(params)
                userList.value = list;
                paper.total = page.total 
            }catch(error){
                console.log(error)
            }
            
        }

        const handleQuery = ()=>{
            
        }
        //重置表单
        const handleReset = (form)=>{
            proxy.$refs[form].resetFields()
        }
        //实现跳转到某页
        const handleCurrentChange = (current)=>{
            paper.pageNum = current;
            getUserList();
        }
        //单个用户的删除
        const handleDel = async (row)=>{
            //接口请求
            await proxy.$api.userDel({
                userIds:[row.userId] //可以删除也可以多个删除
            })
            ElMessage.success('删除成功');
            getUserList();
        }
        //批量删除
        const handlePatchDel = async ()=>{
            if(checkedUserIds.value.length == 0){
                ElMessage.error('请选择要删除的用户');
                return
            }
            const res = await proxy.$api.userDel({
                userIds:checkedUserIds.value
            })
            if(res.nModified > 0){
                ElMessage.success('删除成功');
                getUserList();  
            }else{
                ElMessage.error('修改失败')
            }
            
            
        }

        const handleSelectionChange = (list)=>{
            let arr = [];
            list.map(item=>{
                arr.push(item.userId)
            })
            checkedUserIds.value=arr
        }

        //用户新增
        const handleCreate =()=>{
            action.value = 'add'
            showModal.value = true;
        }
        //获取部门列表(用户新增表单)
        const getDeptList = async ()=>{
            let list = await proxy.$api.getDeptList();
            deptList.value = list;
        }
        //获取角色名称列表(用户新增表单)
        const getRoleList = async ()=>{
            let list = await proxy.$api.getRoleList();
            roleList.value = list;
        }
        //用户新增弹窗关闭
        const handleClose = ()=>{
            showModal.value = false;
            handleReset("dialogForm"); //实现与上边表单查询重置的公用
        }
        //用户新增提交
        const handleSubmit = ()=>{
            //提交时校验(与登录时类似)
            proxy.$refs.dialogForm.validate(async (valid)=>{
                if(valid){
                    let params = toRaw(userForm);  //toRaw：将响应式对象转化为普通对象
                    params.action = action.value 
                    params.userEmail += "@outlook.com";//拼接添加邮箱后缀
                    let res = proxy.$api.userSubmit(params);
                    if(res){
                        showModal.value = false;
                        ElMessage.success('用户创建成功');
                        handleReset("dialogForm");
                        getUserList() //刷新列表
                    }
                }
            })
        }

        //用户的编辑(通过上边的scope.row传参拿得每一行的数据实体)
        const handleEdit = (row)=>{
            action.value = "edit";
            //首先加用户新增的框弹出来
            showModal.value = true;
            //$nextTick作用：当点击编辑时，通过下边见用户信息填充到表单中，当点用户新增时清空下边的表单
            proxy.$nextTick(()=>{ 
                Object.assign(userForm,row);//浅拷贝，将原来的用户信息添加到表单上
            })
            
        }
        
        return {
            user,
            userList,
            columns,
            paper,
            checkedUserIds,
            showModal,
            userForm,
            rules,
            deptList,
            roleList,
            action,
            getUserList,
            handleReset,
            handleQuery,
            handleCurrentChange,
            handleDel,
            handlePatchDel,
            handleSelectionChange,
            handleCreate,
            getDeptList,
            getRoleList,
            handleClose,
            handleSubmit,
            handleEdit
        }
    }
}
</script>

<style>
</style>