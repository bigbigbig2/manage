## 简介

企业管理系统MIS全栈vue3-koa2练习项目，使用通用型架构，包含企业人员管理，系统菜单管理，职位(角色)管理，部门管理，审批流管理，审批流申请，审批流审核等功能。

- 前端：`vue3全家桶`
- UI：`elementPlus`
- 服务端：`koa2`
- 数据库：`mongodb`

## 登录功能

![login](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212123105.gif)

## 用户管理

包含用户查询，用户新增，用户编辑，用户删除，批量删除。

![用户管理](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212246442.gif)

![用户管理2](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212251709.gif)

## 菜单管理

包含菜单的项目菜单查询，创建，编辑，删除功能，以及相应按钮的创建已删除（涉及到后面的根据不同用户进行权限控制）

![菜单管理](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212301389.gif)

## 部门管理

![部门管理](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212310007.gif)

## 角色管理

包含角色的创建，角色的菜单控制权限

![角色管理](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204212312996.gif)

## 审批管理部分

当前用户发出休假申请，需要其部门负责人及财务部门负责人登录管理系统后进行审批

![image-20220424221450464](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204242214109.png)

![image-20220424222127189](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204242221831.png)

例如登录WEBGIS部门的漩涡鸣人发起休假申请。

![休假申请](C:/Users/ooco/Desktop/后台管理系统/休假申请.gif)

然后登入其负责人雏田进行审批

![休假审批](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204242224862.gif)

![image-20220424222705050](C:/Users/ooco/AppData/Roaming/Typora/typora-user-images/image-20220424222705050.png)

在登录我爱罗进行审批

![image-20220424223159824](C:/Users/ooco/AppData/Roaming/Typora/typora-user-images/image-20220424223159824.png)

最后在登上漩涡鸣人查看审批状态

![image-20220424223323870](https://cdn.jsdelivr.net/gh/bigbigbig2/image2/img/202204242233790.png)