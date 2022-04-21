<template>
  <div class="user-manage">
    <div class="query-form">
        <el-form ref="form" :inline="true" :model="queryForm">
            <el-form-item label="审批状态" prop="applyState">
                <el-select v-model="queryForm.applyState">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="待审批"></el-option>
                    <el-option :value="2" label="审批中"></el-option>
                    <el-option :value="3" label="审批拒绝"></el-option>
                    <el-option :value="4" label="审批通过"></el-option>
                    <el-option :value="5" label="作废"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type = "primary" @click="getApplyList">查询</el-button>
                <el-button @click="handleReset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="base-table">
        <el-table :data="applyList">
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
                    <el-button  size="mini" @click="handleShowDetail(scope.row)"
                        v-if="scope.row.curAuditUserName == userInfo.userName&&[1,2].includes(scope.row.applyState)"
                    >审核</el-button>
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
    <el-dialog title="审核" v-model="showDetailModal" width="50%" destroy-on-close>
        <el-form ref="dialogForm" :model="auditForm" label-width="120px" label-suffix=":" :rules="rules">
            <el-form-item label="申请人">
                <div>{{detail.applyUser.userName}}</div> 
            </el-form-item>
            <el-form-item label="休假类型">
                <div>{{detail.applyTypeName}}</div> 
            </el-form-item>
            <el-form-item label="休假时间">
                <div>{{detail.time}}</div> 
            </el-form-item>
            <el-form-item label="休假时长">
                <div>{{detail.leaveTime}}</div>  
            </el-form-item>
            <el-form-item label="休假原因">
                <div>{{detail.reasons}}</div> 
            </el-form-item>
            <el-form-item label="审批状态">
                <div>{{detail.applyStateName}}</div> 
            </el-form-item>
            <el-form-item label="审批人">
                <div>{{detail.curAuditUserName}}</div> 
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="3" placeholder="请输入审核备注" v-model="auditForm.remark"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button  @click="handleApprove('refuse')" >审核拒绝</el-button>
                <el-button type="primary" @click="handleApprove('pass')">审核通过</el-button>   
            </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance,onMounted,ref,reactive} from "vue"
import { ElMessage } from 'element-plus' //按需引入，全局导入有毛病
import utils from "../utils/utils";
export default {
    name:'approve',
    setup(){
        //获取composition api上下文对象
        const {proxy} = getCurrentInstance();
        //初始化用户表单对象
        const queryForm = reactive({
            applyState:1
        })
        //初始化分页对象
        const pager = reactive({
            pageNum:1,
            pageSize:10,
            total:1
        });
        //定义表格的格式
        const columns = reactive([
            {
                label:'单号',
                prop:'orderNo'
            },
            {
                label:'申请人',
                prop:'applyUser.userName',
            },
            {
                label:'休假时间',
                prop:'',
                formatter(row){
                    return utils.formateDate(new Date(row.startTime),"yyyy-MM-dd") + "至" + utils.formateDate(new Date(row.endTime),"yyyy-MM-dd")
                }
            },
            {
                label:'休假时长',
                prop:'leaveTime',
            },
            {
                label:'休假类型',
                prop:'applyType',
                formatter(row,column,value){
                    return {
                        1:'事假',
                        2:'离职',
                        3:'试用期'
                    }[value]
                }
            },
            {
                label:'休假原因',
                prop:'reasons'
            },
            {
                label:'申请时间',
                prop:'createTime',
                formatter:(row,column,value)=>{
                    return utils.formateDate(new Date(value))
                }
            },
            {
                label:'审批人',
                prop:'auditUsers',
            },
            {
                label:'当前审批人',
                prop:'curAuditUserName',
            },
            {
                label:'审批状态',
                prop:'applyState',
                formatter(row,column,value){
                    return {
                        1:'待审批',
                        2:'审批中',
                        3:'审批拒绝',
                        4:'审批通过',
                        5:'作废'
                    }[value]
                }
            },
            
        ])
        //休假申请填写表单
        const leaveForm =reactive ({
            applyType:1,
            startTime:'',
            endTime:'',
            leaveTime:'0天',
            reasons:''

        })

        const auditForm = reactive({
            remark:''
        })

        //休假列表
        const applyList = ref([])

        const showModal = ref(false)

        const showDetailModal =ref(false)
        const action = ref('create')

        const rules = reactive({
            remark:[
                {
                    required: true,
                    message:'请输入审核备注',
                    trigger:'change'

                }
            ]
        })
        //详情弹框对象
        const detail = ref({});

        const userInfo = proxy.$store.state.userInfo
        onMounted(()=>{
            getApplyList()
        })
        
        //获取申请列表
        const getApplyList = async ()=>{
            let params = {...queryForm,...pager,type:"approve"}
            let { list , page }=await proxy.$api.getApplayList(params)
            applyList.value = list;
            pager.total = page.total
        }
        //重置表单
        const handleReset = (form)=>{
            proxy.$refs[form].resetFields()
        }
        const handleClose = ()=>{
            showDetailModal.value = false;
            handleReset('dialogForm')
        }
        //提交表单
        const handleSubmit=()=>{
            proxy.$refs.dialogForm.validate(async (valid) => {
                if(valid){
                    let params = {action:action.value}
                    let res = await proxy.$api.leaveOperate(params)
                    ElMessage.success('创建成功');
                    handleClose();
                    getApplyList();
                }
            })
        }
        const handleCurrentChange = (current)=>{
            pager.pageNum = current;
        }



        const handleShowDetail = (row)=>{
            let data = {...row};
            //映射成一个新的对象，下面对row的数据做一下加工然后在显示出来
            data.applyTypeName = {
                1:'事假',
                2:'调休',
                3:'年假'
            }[data.applyType];
            data.time =utils.formateDate(new Date(row.startTime),"yyyy-MM-dd") + "至" + utils.formateDate(new Date(row.endTime),"yyyy-MM-dd");
            data.applyStateName = {
                1:'待审批',
                2:'审批中',
                3:'审批拒绝',
                4:'审批通过',
                5:'作废'
            }[data.applyState]
            detail.value = data;
            showDetailModal.value = true
            
        }

        const handleApprove =(action)=>{
            proxy.$refs.dialogForm.validate(async (valid) => {
                if(valid){
                    let params = {action,remark:auditForm.remark,_id:detail.value._id}
                    try{
                        await proxy.$api.leaveApprove(params)
                        handleClose();
                        ElMessage.success('操作成功');
                        getApplyList();
                        proxy.$store.commit("saveNoticeCount",proxy.$store.state.noticeCount-1);
                        
                    }catch(e){
                        console.log(e)
                    }
                }
            })
        }
        return {
            pager,
            queryForm,
            columns,
            applyList,
            showModal,
            action,
            leaveForm,
            rules,
            showDetailModal,
            detail,
            userInfo,
            auditForm,
            handleReset,
            handleCurrentChange,
            getApplyList,
            handleClose,
            handleSubmit,
            handleShowDetail,
            handleApprove
        }
    }
}
</script>

<style>
</style>