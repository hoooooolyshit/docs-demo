# 生态校园管理系统









## 简记

后端

下载若依后端spring3版本源码zip解压后用IDEA打开

项目结构勾选JDK17版本

Maven设置3.0以上版本并等待依赖加载完成

文件编码设置为UTF-8

部署mysql8并执行sql脚本，修改数据源配置

部署redis3.0以上版本，修改redis配置

启动后端服务

前端

下载若依前端vue3版本源码zip解压后用VS Code打开

要求Node18以上版本，管理员身份启动终端，输入命令npn install安装相关依赖

修改配置文件中后端服务的地址

在后端服务启动的前提下，输入命令npm run dev启动前端应用











2、构建开发环境：在服务器上部署mysql、redis，做好初始化配置，先在本地将项目跑起来

3、利用若依插件修改项目名，前端与若依相关内容全部修改或删除，推送到gitee定为1.0.0版本

4、构建测试环境：把1.0版本打包并利用Docker Compose部署到服务器

5、需求分析，设计接口文档、设计数据库等等

6、设计、前后端开发、测试同步进行

7、设计到一定进度就开发，开发到一定进度就推送版本并打包部署测试，测试完了再设计，循环往复

8、构建生产环境：项目完成1.1.0版本，正式发布

9、后续项目的更新和维护



若依功能：

权限认证：不同角色能访问不同菜单，不同部门访问不同数据

数据字典：管理静态数据，如性别等

参数设置：如验证码开关，注册开关等

通知公告：预留功能，待二次开发

日志管理：建议用定时任务定期保存日志文件并清理

系统监控：供系统维护人员查看

表单构建：通过图形界面和拖拽等操作，快速构建复杂的表单

代码生成、定时任务、接口测试







## 项目设计





### 前端原型设计



### 数据库设计

#### 学生表

```sql
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '学生ID',
  `username` varchar(50) NOT NULL COMMENT '账号（可用于登录）',
  `password` varchar(100) DEFAULT NULL COMMENT '密码（可空，支持微信一键登录）',
  `nickname` varchar(100) NOT NULL COMMENT '昵称',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `openid` varchar(100) DEFAULT NULL COMMENT '微信openid',
  `unionid` varchar(100) DEFAULT NULL COMMENT '微信unionid',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '账号状态：1-正常 0-禁用',
  `total_integral` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总积分',
  `current_integral` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '当前积分',
  `delivery_count` int(11) NOT NULL DEFAULT '0' COMMENT '投递次数',
  `last_delivery_time` datetime DEFAULT NULL COMMENT '最后投递时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';
```

校园信息表

```sql
CREATE TABLE `campus_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `student_id` bigint(20) DEFAULT NULL COMMENT '绑定的学生ID（初始为NULL）',
  `real_name` varchar(50) NOT NULL COMMENT '真实姓名',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别：0-女 1-男',
  `student_number` varchar(50) NOT NULL COMMENT '学号',
  `grade` varchar(20) DEFAULT NULL COMMENT '年级（如：2023级）',
  `college` varchar(100) DEFAULT NULL COMMENT '院系',
  `major` varchar(100) DEFAULT NULL COMMENT '专业',
  `class_name` varchar(50) DEFAULT NULL COMMENT '班级',
  `dorm_building` varchar(50) DEFAULT NULL COMMENT '宿舍楼',
  `dorm_number` varchar(20) DEFAULT NULL COMMENT '宿舍号',
  `room_number` varchar(20) DEFAULT NULL COMMENT '房间号',
  `campus` varchar(100) DEFAULT NULL COMMENT '校区',
  `school_name` varchar(100) NOT NULL COMMENT '学校名称',
  `bind_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '绑定状态：0-未绑定 1-已绑定',
  `bind_time` datetime DEFAULT NULL COMMENT '绑定时间',
  `import_batch` varchar(50) DEFAULT NULL COMMENT '导入批次号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_school_student_number` (`school_name`, `student_number`),
  UNIQUE KEY `uk_student_id` (`student_id`),
  KEY `idx_bind_status` (`bind_status`),
  KEY `idx_school_name` (`school_name`),
  KEY `idx_student_number` (`student_number`),
  KEY `idx_real_name` (`real_name`),
  KEY `idx_import_batch` (`import_batch`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园信息表';
```

设备表：

```sql
CREATE TABLE `garbage_device` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '设备ID',
  `device_no` varchar(50) NOT NULL COMMENT '设备编号（唯一）',
  `device_name` varchar(100) NOT NULL COMMENT '设备名称',
  `device_type` varchar(20) NOT NULL COMMENT '设备类型：four_bin-四桶 six_bin-六桶 eight_bin-八桶',
  `device_model` varchar(50) DEFAULT NULL COMMENT '设备型号',
  
  -- 网络状态相关
  `network_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '网络状态：0-离线 1-在线',
  `network_update_time` datetime DEFAULT NULL COMMENT '网络状态更新时间',
  `pp_network_status` tinyint(1) DEFAULT '0' COMMENT 'PP网络状态：0-离线 1-在线',
  `pp_network_update_time` datetime DEFAULT NULL COMMENT 'PP网络状态更新时间',
  
  -- 地址信息
  `address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区域/区县',
  `street` varchar(100) DEFAULT NULL COMMENT '街道',
  `village` varchar(100) DEFAULT NULL COMMENT '村庄/社区',
  
  -- 学校信息
  `school_name` varchar(100) NOT NULL COMMENT '学校名称',
  `school_short_name` varchar(50) DEFAULT NULL COMMENT '学校简称',
  `campus` varchar(100) DEFAULT NULL COMMENT '校区',
  `area_code` varchar(20) DEFAULT NULL COMMENT '区域编号',
  `school_code` varchar(20) DEFAULT NULL COMMENT '学校编号',
  
  -- 状态信息
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备状态：1-正常 2-故障 3-维修中 4-停用',
  `bin_full_status` tinyint(1) DEFAULT '0' COMMENT '垃圾桶满状态：0-未满 1-部分满 2-全部满',
  `is_binded` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否绑定：0-未绑定 1-已绑定',
  `is_disabled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '设备是否禁用：0-启用 1-禁用',
  
  -- 位置坐标
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `location` point DEFAULT NULL COMMENT '空间位置坐标（用于GIS查询）',
  
  -- 系统字段
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_device_no` (`device_no`),
  KEY `idx_device_type` (`device_type`),
  KEY `idx_network_status` (`network_status`),
  KEY `idx_school_name` (`school_name`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  SPATIAL KEY `idx_location` (`location`) COMMENT '空间索引，用于位置查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='垃圾回收设备表';
```

仓位表：

```sql
CREATE TABLE `garbage_bin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '仓位ID',
  `bin_no` varchar(50) NOT NULL COMMENT '仓位编号（唯一）',
  `device_id` bigint(20) NOT NULL COMMENT '设备ID',
  `device_no` varchar(50) NOT NULL COMMENT '设备编号',
  `bin_type` varchar(20) NOT NULL COMMENT '垃圾类型：recyclable-可回收 harmful-有害 kitchen-厨余 other-其他',
  `bin_index` tinyint(2) NOT NULL COMMENT '仓位序号（1,2,3,4...）',
  
  -- 状态信息
  `bin_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '仓位状态：0-正常 1-故障 2-维修中 3-停用',
  `is_full` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否满溢：0-未满 1-满溢',
  `is_disabled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否禁用：0-启用 1-禁用',
  `is_idle` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否空闲：0-使用中 1-空闲',
  
  -- 硬件控制状态
  `fan_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '风扇状态：0-关闭 1-开启',
  `door_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '门状态：0-关闭 1-开启',
  `lock_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '锁状态：0-解锁 1-锁定',
  `anti_trap_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '防夹状态：0-正常 1-触发防夹',
  
  -- 传感器数据
  `weight` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '当前重量（kg）',
  `height` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT '当前高度（cm）',
  `weight_limit` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '重量限制（kg）',
  `height_limit` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT '高度限制（cm）',
  
  -- 故障信息
  `fault_code` varchar(50) DEFAULT NULL COMMENT '故障代码',
  `fault_description` varchar(200) DEFAULT NULL COMMENT '故障描述',
  
  -- 业务信息
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司ID',
  `qr_code` varchar(200) DEFAULT NULL COMMENT '二维码内容',
  `qr_code_url` varchar(500) DEFAULT NULL COMMENT '二维码图片URL',
  
  -- 统计信息
  `delivery_count` int(11) NOT NULL DEFAULT '0' COMMENT '投递次数',
  `last_delivery_time` datetime DEFAULT NULL COMMENT '最后投递时间',
  
  -- 系统字段
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bin_no` (`bin_no`),
  UNIQUE KEY `uk_device_bin_index` (`device_id`, `bin_index`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_device_no` (`device_no`),
  KEY `idx_bin_type` (`bin_type`),
  KEY `idx_bin_status` (`bin_status`),
  KEY `idx_is_full` (`is_full`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='垃圾回收设备仓位表';
```

投递记录表

```sql
CREATE TABLE `delivery_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '投递记录ID',
  
  -- 投递时间信息
  `start_time` datetime DEFAULT NULL COMMENT '投递开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '投递结束时间',
  `delivery_date` date NOT NULL COMMENT '投递日期（用于按日统计）',
  
  -- 重量和高度变化
  `start_weight` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '投递前重量（kg）',
  `end_weight` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '投递后重量（kg）',
  `delivery_weight` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '本次投递净重量（kg）',
  `start_height` decimal(6,2) DEFAULT '0.00' COMMENT '投递前高度（cm）',
  `end_height` decimal(6,2) DEFAULT '0.00' COMMENT '投递后高度（cm）',
  
  -- 积分信息
  `points_earned` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '获得积分',
  
  -- 设备信息
  `device_id` bigint(20) NOT NULL COMMENT '设备ID',
  `device_no` varchar(50) NOT NULL COMMENT '设备编号',
  `device_name` varchar(100) DEFAULT NULL COMMENT '设备名称',
  
  -- 仓位信息
  `bin_id` bigint(20) NOT NULL COMMENT '仓位ID',
  `bin_no` varchar(50) NOT NULL COMMENT '仓位编号',
  `bin_type` varchar(20) NOT NULL COMMENT '垃圾类型：recyclable-可回收 harmful-有害 kitchen-厨余 other-其他',
  `bin_index` tinyint(2) NOT NULL COMMENT '仓位序号',
  
  -- 用户信息
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `username` varchar(50) NOT NULL COMMENT '用户账号',
  `nickname` varchar(100) DEFAULT NULL COMMENT '用户昵称',
  
  -- 系统字段
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_bin_id` (`bin_id`),
  KEY `idx_delivery_date` (`delivery_date`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_device_bin_date` (`device_id`, `bin_id`, `delivery_date`),
  KEY `idx_student_date` (`student_id`, `delivery_date`),
  KEY `idx_bin_type` (`bin_type`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='垃圾投递记录表';
```

积分变动表

```sql
CREATE TABLE `integral_change_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  
  -- 用户信息
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `username` varchar(50) NOT NULL COMMENT '用户账号',
  `nickname` varchar(100) DEFAULT NULL COMMENT '用户昵称',
  
  -- 积分变动核心信息
  `change_type` varchar(20) NOT NULL COMMENT '变动类型：delivery-投递 exchange-兑换 recharge-充值 adjust-调整 reward-奖励 deduct-扣除',
  `change_direction` tinyint(1) NOT NULL COMMENT '变动方向：1-增加 0-减少',
  `points` decimal(10,2) NOT NULL COMMENT '变动积分数',
  `current_points` decimal(10,2) NOT NULL COMMENT '变动后当前积分',
  
  -- 业务关联信息（根据change_type不同，部分字段可能为空）
  `related_id` varchar(100) DEFAULT NULL COMMENT '关联业务ID（投递记录ID、兑换订单ID等）',
  `related_type` varchar(50) DEFAULT NULL COMMENT '关联业务类型',
  
  -- 投递相关字段（change_type = 'delivery' 时使用）
  `device_id` bigint(20) DEFAULT NULL COMMENT '设备ID',
  `device_no` varchar(50) DEFAULT NULL COMMENT '设备编号',
  `device_name` varchar(100) DEFAULT NULL COMMENT '设备名称',
  `bin_id` bigint(20) DEFAULT NULL COMMENT '仓位ID',
  `bin_no` varchar(50) DEFAULT NULL COMMENT '仓位编号',
  `bin_type` varchar(20) DEFAULT NULL COMMENT '垃圾类型',
  `bin_type_name` varchar(50) DEFAULT NULL COMMENT '垃圾类型名称',
  `delivery_weight` decimal(8,2) DEFAULT NULL COMMENT '投递重量（kg）',
  
  -- 兑换相关字段（change_type = 'exchange' 时使用）
  `exchange_code` varchar(100) DEFAULT NULL COMMENT '兑换码',
  `merchant_name` varchar(100) DEFAULT NULL COMMENT '商户名称',
  `goods_name` varchar(200) DEFAULT NULL COMMENT '商品名称',
  `exchange_amount` decimal(10,2) DEFAULT NULL COMMENT '兑换金额',
  `is_fail` tinyint(1) DEFAULT '0' COMMENT '是否失败：0-成功 1-失败',
  `fail_reason` varchar(200) DEFAULT NULL COMMENT '失败原因',
  
  -- 调整相关字段（change_type = 'adjust' 时使用）
  `adjust_reason` varchar(200) DEFAULT NULL COMMENT '调整原因',
    
  `operator_id` bigint(20) DEFAULT NULL COMMENT '操作员ID',
  `operator_name` varchar(50) DEFAULT NULL COMMENT '操作员姓名',
  
  -- 通用信息
  `change_date` date NOT NULL COMMENT '变动日期（用于按日统计）',
  `description` varchar(500) DEFAULT NULL COMMENT '变动描述',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  
  -- 系统字段
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_username` (`username`),
  KEY `idx_change_type` (`change_type`),
  KEY `idx_change_date` (`change_date`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_bin_id` (`bin_id`),
  KEY `idx_exchange_code` (`exchange_code`),
  KEY `idx_student_date_type` (`student_id`, `change_date`, `change_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分变动记录表';
```

清运明细表

广告管理

文本管理

升级管理

### 项目结构设计

#### 命名

ECMS（Eco-Campus Management System）

创建项目时使用ecms作为根目录名称

前端开发‌：

组件命名：EcmsHeader.vue、EcmsDashboard.vue

路由配置：/ecms/dashboard、/ecms/waste-tracking

状态管理：ecmsStore、ecmsModules

‌后端架构‌：

包结构：com.ecms.controller、com.ecms.service

数据库：ecms_users、ecms_waste_records

API端点：/ecms/api/v1/waste





### 接口设计





## 业务模块开发



### 学生管理







### 设备管理







### 投递管理





### 清运管理





### 积分管理





### 其他管理

