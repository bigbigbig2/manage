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
                    <el-option :value="3" label="审批通过"></el-option>
                    <el-option :value="3" label="作废"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type = "primary" @click="getApplyList">查询</el-button>
                <el-button @click="handleReset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="base-table">
        <div class="action" >
            <el-button type="primary" v-has:add="'user-create'" @click="handleApply">休假申请</el-button>
        </div>
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
                    <el-button  size="mini" @click="handleShowDetail(scope.row)">查看</el-button>
                    <el-button type="danger" size="mini" @click = handleDetailDelete(scope.row._id) v-if="[1,2].includes(scope.row.applyState)">作废</el-button>
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
    <el-dialog title="休假申请" v-model="showModal" width="60%" >
        <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
            <el-form-item label="休假类型" prop="applyType">
                <el-select v-model="leaveForm.applyType">
                <el-option label="事假" :value="1"></el-option>
                <el-option label="调休" :value="2"></el-option>
                <el-option label="年假" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="休假时间" prop="leaveTime">
            <el-row>
                <el-col :span="8">
                    <el-form-item prop="startTime">
                        <el-date-picker
                            v-model="leaveForm.startTime"
                            type="date"
                            placeholder="请选择开始时间"
                            @change="(val)=>handleDateChange('startTime')"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="1">-</el-col>
                <el-col :span="8">
                    <el-form-item prop="endTime">
                        <el-date-picker
                            v-model="leaveForm.endTime"
                            type="date"
                            placeholder="请选择结束时间"
                            @change="(val)=>handleDateChange('endTime')"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="休假时长" >
        {{leaveForm.leaveTime}}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
            <el-input
                type="textarea"
                :row="4"
                placeholder="请输入休假原因"
                v-model="leaveForm.reasons"
            ></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" >确定</el-button>
        </span>
    </template>
    </el-dialog>
    <el-dialog title="休假申请详情" v-model="showDetailModal" width="50%" destroy-on-close>
        <el-steps :active="detail.applyState >2?3:detail.applyState" align-center>
            <el-step title="待审批"></el-step>
            <el-step title="审批中"></el-step>
            <el-step title="审批通过/拒绝"></el-step>
        </el-steps>
        <el-form label-width="120px" label-suffix=":">
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
        </el-form>
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
        const queryForm = reactive({
            applyState:""
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
            }
        ])
        //休假申请填写表单
        const leaveForm =reactive ({
            applyType:1,
            startTime:'',
            endTime:'',
            leaveTime:'0天',
            reasons:''

        })

        //休假列表
        const applyList = ref([])

        const showModal = ref(false)

        const showDetailModal =ref(false)
        const action = ref('create')

        const rules = reactive({
            startTime:[
                {
                    type: 'date',
                    required: true,
                    message:'请选择开始日期',
                    trigger:'change'

                }
            ],
            endTime:[
                {
                    type: 'date',
                    required: true,
                    message:'请选择结束日期',
                    trigger:'change'
                }
            ],
            reasons:[
                {
                    required: true,
                    message:'请输入休假原因',
                    trigger:['blur','change']
                }
            ]
        })

        const detail = ref({});

        onMounted(()=>{
            getApplyList()
        })
        
        //获取申请列表
        const getApplyList = async ()=>{
            let params = {...queryForm,...pager}
            let { list , page }=await proxy.$api.getApplayList(params)
            applyList.value = list;
            pager.total = page.total
        }
        //重置表单
        const handleReset = (form)=>{
            proxy.$refs[form].resetFields()
        }
        const handleClose = ()=>{
            showModal.value = false;
            handleReset('dialogForm')
        }
        //提交表单
        const handleSubmit=()=>{
            proxy.$refs.dialogForm.validate(async (valid) => {
                if(valid){
                    let params = {...queryForm,action:action.value}
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

        //点击休假申请
        const handleApply = ()=>{
            showModal.value = true;
            action.value = 'create'
        }

        //获取休假时长
        const handleDateChange =(key,val)=>{
            let {startTime,endTime} = leaveForm;
            if(!startTime || !endTime) return;
            if(startTime>endTime){
                ElMessage.error('开始日期不能晚于结束日期');
                leaveForm.leaveTime = '0天'
                setTimeout(()=>{
                    leaveForm[key] = "";
                }, 0);
            }else{
                leaveForm.leaveTime =(endTime-startTime)/(24*60*60*1000) + 1 + "天"
            }
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
        const handleDetailDelete =async (_id)=>{
            let params = {_id,action:"delete"}
            await proxy.$api.leaveOperate(params)
            ElMessage.success('删除成功');
            getApplyList();
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
            handleReset,
            handleCurrentChange,
            getApplyList,
            handleApply,
            handleClose,
            handleSubmit,
            handleDateChange,
            handleShowDetail,
            handleDetailDelete
        }
    }
}
</script>

<style>
</style>