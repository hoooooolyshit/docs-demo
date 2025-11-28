# 基础

## MySQL概述

| 名称           | 全称                                                       | 简称                               |
| -------------- | ---------------------------------------------------------- | ---------------------------------- |
| 数据库         | 存储数据的仓库，数据是有组织的进行存储                     | DataBase（DB）                     |
| 数据库管理系统 | 操纵和管理数据库的大型软件                                 | DataBase Management System（DBMS） |
| SQL            | 操作关系型数据库的语言，定义了一套操作关系型数据库统一标准 | Structured Query Language（SQL）   |

Windows

```shell
# 启动服务
net start mysql80
# 停止服务
net stop mysql80
# MySQL客户端连接
mysql [-h 127.0.0.1] [-P 3306] -uroot -p
```

## SQL分类

| 分类 |            全称            | 说明                                                   |
| :--: | :------------------------: | :----------------------------------------------------- |
| DDL  |  Data Definition Language  | 数据定义语言，用来定义数据库对象（数据库、表、字段）   |
| DML  | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改         |
| DQL  |    Data Query Language     | 数据查询语言，用来查询数据库表中的记录                 |
| DCL  |   Data Control Language    | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |

## DDL 数据定义语言

### 数据库操作

```sql
# 查询所有数据库
show databases;
# 查询当前数据库
select database();
# 创建数据库
create database [if not exists] 数据库名 [default charset 字符集] [collate 排序规则];
# 删除数据库
drop database [if exists] 数据库名;
# 使用数据库
use 数据库名;
```

### 表操作

```sql
# 查询当前数据库所有表
show tables;
# 查询表结构
desc 表名;
# 查询指定表的建表语句
show create table `表名`;
# 创建表
create table [if not exists] 表名(
	`字段名` 字段类型 [字段选项]
)[表选项]
# 添加字段
alter table 表名 add 字段名 类型(长度) [约束];
# 修改字段数据类型
alter table 表名 modify 字段名 新数据类型(长度);
# 修改字段名和字段类型
alter table 表名 change 旧字段名 新字段名 类型(长度) [约束];
# 删除字段
alter table 表名 drop 字段名;
# 修改表名
alter table 表名 rename to 新表名;
# 删除表
drop table [if exists] 表名;
# 删除指定表，并重新创建该表
truncate table 表名;
```

## DML 数据操作语言

### 添加、修改、删除数据

```sql
# 给指定字段添加数据
insert into 表名 (字段名1, 字段名2, ...) values (值1, 值2, ...);
# 给全部字段添加数据
insert into 表名 values (值1, 值2, ...);
# 批量添加数据
insert into 表名 (字段名1,字段名2,...) values (值1,值2,...),(值1,值2,...),(值1,值2,...);
insert into 表名 values (值1,值2,...),(值1,值2,...),(值1,值2,...);
# 修改数据
update 表名 set 字段名1=值1, 字段名2=值2, ... [where 条件];
# 删除数据
delete from 表名 [where 条件];
```

## DQL 数据查询语言

### 语法

```sql
select 字段列表
from 表名列表
where 条件列表
group by 分组字段列表
having 分组后条件列表
order by 排序字段列表
limit 分页参数
```

执行顺序

1.  from	2.where	3.group by	4.having	5.select	6.order by	7.limit

### 基本查询

```sql
# 查询多个字段
select 字段1,字段2,... from 表名;
select * from 表名;
# 设置别名
select 字段1 [as 别名1],字段2 [as 别名2],... from 表名;
# 去除重复记录
select distinct 字段列表 from 表名;
```

### 条件查询

语法

```sql
select 字段列表
from 表名
where 条件列表
```

条件

| 比较运算符          | 功能                                       |
| ------------------- | ------------------------------------------ |
| >                   | 大于                                       |
| >=                  | 大于等于                                   |
| <                   | 小于                                       |
| <=                  | 小于等于                                   |
| =                   | 等于                                       |
| <> 或 !=            | 不等于                                     |
| between ... and ... | 在某个范围之内（含最小、最大值）           |
| in(...)             | 在 in 之后的列表中的值，多选一             |
| like 占位符         | 模糊匹配（_ 匹配单个字符，% 匹配多个字符） |
| is null             | 是 null                                    |

| 逻辑运算符 | 功能                         |
| ---------- | ---------------------------- |
| and 或 &&  | 并且（多个条件同时成立）     |
| or 或 \|\| | 或者（多个条件任意一个成立） |
| not 或 !   | 非，不是                     |

### 聚合函数

将一列数据作为一个整体，进行纵向计算

常见聚合函数

| 函数  | 功能     |
| ----- | -------- |
| count | 统计数量 |
| max   | 最大值   |
| min   | 最小值   |
| avg   | 平均值   |
| sum   | 求和     |

语法

```sql
select 聚合函数(字段列表)
from 表名;
```

### 分组查询

语法

```sql
select 字段列表
from 表名
[where 条件]
group by 分组字段名
[having 分组后过滤条件];
```

#### where 与 having 区别

-   执行时机不同：where 是分组之前进行过滤，不满足 where 条件不参与分组；而 having 是分组之后对结果进行过滤。
-   判断条件不同：where 不能对聚合函数进行判断，而 having 可以；

案例：查询年龄小于 45 的员工，并根据工作地址分组，获取员工数量大于等于 3 的工作地址

```sql
select workaddress, count(*) address_count
from emp
where age < 45
group by workaddress
having address_count >= 3;
```

>   注意：
>
>   -   执行顺序：where > 聚合函数 > having
>   -   分组之后，查询的字段一般为聚合函数和分组字段，查询其它字段无任何意义。

### 排序查询

语法

```sql
select 字段列表
from 表名
order by 字段1 排序方式1,字段2 排序字段2;
```

排序方式

-   ASC：升序（默认值）
-   DESC：降序

### 分页查询

语法

```sql
select 字段列表
from 表名
limit 偏移量（起始索引）,条目数（查询记录数）
```

>   分页计算
>
>   起始索引 = (页码 - 1) * 每页条数；条目数 = 每页条数。

## DCL 数据控制语言

### 管理用户

```sql
# 查询用户
use mysql;
select * from user;
# 创建用户
create user '用户名'@'主机名' identified by '密码';
create user '用户名'@'%' identified by '密码'; # 任意主机都能访问
# 修改用户密码
alter user '用户名'@'主机名' identified with mysql_native_password by '新密码';
# 删除用户
drop user '用户名'@'主机名';
```

### 权限控制

MySQL中定义了很多种权限，但是常用的就以下几种：

| 权限                | 说明               |
| ------------------- | ------------------ |
| all，all privileges | 所有权限           |
| select              | 查询数据           |
| insert              | 插入数据           |
| update              | 修改数据           |
| delete              | 删除数据           |
| alter               | 修改表             |
| drop                | 删除数据库/表/视图 |
| create              | 创建数据库/表      |

```sql
# 查询权限
show grants for '用户名'@'主机名';
# 授予权限
grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';
# 撤销权限
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';
```

>   -   多个权限之间，使用逗号分隔；
>   -   授权时，数据库名和表名可以使用 * 进行通配，代表所有。

## 函数

### 字符串函数

| 函数                     | 功能                                                         |
| ------------------------ | ------------------------------------------------------------ |
| concat(S1,S2,...,Sn)     | 字符串拼接，将 S1,S2,...,Sn 拼接成一个字符串                 |
| lower(str)               | 将字符串 str 全部转为小写                                    |
| upper(str)               | 将字符串 str 全部转为大写                                    |
| lpad(str,n,pad)          | 左填充，用字符串 pad 对 str 的左边进行填充，达到 n 个字符串长度 |
| rpad(str,n,pad)          | 右填充，用字符串 pad 对 str 的右边进行填充，达到 n 个字符串长度 |
| trim(str)                | 去掉字符串首尾的空格                                         |
| substring(str,start,len) | 返回从字符串 str 从 start 位置起的 len 个长度的字符串        |

### 数值函数

| 函数       | 功能                                   |
| ---------- | -------------------------------------- |
| ceil(x)    | 向上取整                               |
| floor(x)   | 向下取整                               |
| mod(x,y)   | 返回 x/y 的模                          |
| rand()     | 返回 0~1 内的随机数                    |
| round(x,y) | 求参数 x 的四舍五入的值，保留 y 位小数 |

案例：通过数据库的函数，生成一个六位数的随机验证码

```sql
select lpad(round(rand() * 1000000, 0), 6, '0');
```

### 日期函数

| 函数                              | 功能                                                |
| --------------------------------- | --------------------------------------------------- |
| curdate()                         | 返回当前日期                                        |
| curtime()                         | 返回当前时间                                        |
| now()                             | 返回当前日期和时间                                  |
| year(date)                        | 获取指定 date 的年份                                |
| month(date)                       | 获取指定 date 的月份                                |
| day(date)                         | 获取指定 date 的日期                                |
| date_add(date,interval expr type) | 返回一个日期/时间值加上一个时间间隔 expr 后的时间值 |
| datediff(date1,date2)             | 返回起始时间 date2 和结束时间 date1 之间的天数      |

案例：数据库表中，存储的是入职日期，如 2000-11-12，如何快速计算入职天数？

```sql
select datediff(curdate(), 入职日期字段), 字段列表 from 表名;
```

### 流程函数

| 函数                                                       | 功能                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| if(value,t,f)                                              | 如果 value 为 true，则返回 t，否则返回 f                     |
| ifnull(value1,value2)                                      | 如果 value1 不为空，返回 value1，否则返回 value2             |
| case when [val1] then [res1] ... else [default] end        | 如果 val1 为 true，返回 res1，…否则返回 default 默认值       |
| case [expr] when [val1] then [res1] ... else [default] end | 如果 expr 的值等于 val1，返回 res1，…否则返回 default 默认值 |

案例：数据库表中，存储的是学生的分数值，如 98、75，如何快速判定分数的等级？

```sql
select case 
	when 分数字段>=80 then 优秀 
	when 分数字段>=60 and 分数字段<80 then 及格
	else 不及格 end 别名, 字段列表
from 表名;
```

## 数据类型

### 数值类型

| 类型           | 大小    | 有符号（SIGNED）范围      | 无符号（UNSIGNED）范围 | 描述                 |
| -------------- | ------- | ------------------------- | ---------------------- | -------------------- |
| tinyint        | 1 byte  | (-128, 127)               | (0, 255)               | 小整数值             |
| smallint       | 2 bytes |                           |                        |                      |
| mediumint      | 3 bytes |                           |                        |                      |
| int 或 integer | 4 bytes | (-2147483648, 2147483647) | (0, 4294967295)        | 大整数值             |
| bigint         | 8 bytes |                           |                        | 极大整数值           |
| float          | 4 bytes |                           |                        | 单精度浮点数值       |
| double         | 8 bytes |                           |                        | 双精度浮点数值       |
| decimal        |         |                           |                        | 小数值（精确定点数） |

### 字符串类型

| 类型       | 大小               | 描述                         |
| ---------- | ------------------ | ---------------------------- |
| char       | 0~255 bytes        | 定长字符串                   |
| varchar    | 0~65535 bytes      | 变长字符串                   |
| tinyblob   | 0~255 bytes        | 不超过255个字符的二进制数据  |
| tinytext   | 0~255 bytes        | 短文本字符串                 |
| blob       | 0~65535 bytes      | 二进制形式的长文本数据       |
| text       | 0~65535 bytes      | 长文本数据                   |
| mediumblob | 0~16777215 bytes   | 二进制形式的中等长度文本数据 |
| mediumtext | 0~16777215 bytes   | 中等长度文本数据             |
| longblob   | 0~4294967295 bytes | 二进制形式的极大文本数据     |
| longtext   | 0~4294967295 bytes | 极大文本数据                 |

### 日期类型

| 类型      | 大小 | 范围                                     | 格式                | 描述                     |
| --------- | ---- | ---------------------------------------- | ------------------- | ------------------------ |
| date      | 3    | 1000-01-01至9999-12-31                   | YYYY-MM-DD          | 日期值                   |
| time      | 3    | -838:59:59至838:59:59                    | HH:MM:SS            | 时间值或持续时间         |
| year      | 1    | 1901至2155                               | YYYY                | 年份值                   |
| datetime  | 8    | 1000-01-01 00:00:00至9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| timestamp | 4    | 1970-01-01 00:00:01至2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值，时间戳 |

## 约束

约束是作用于表中字段上的规则，用于限制存储在表中的数据

目的：保证数据库中数据的正确性、有效性和完整性

为了保证数据的完整性、精确性、可靠性，对表中的字段进行限制

### 约束的分类

-   根据约束数据列的限制：
    -   单列约束
    -   多列约束（复合约束）
-   根据约束的作用范围：
    -   列级约束（直接写在指定列后）
    -   表级约束（写在所有列最后，【CONSTRAINT 约束名】 约束关键字(约束列)）
-   根据约束起的作用：
    -   NOT NULL：非空约束，规定某个字段不能为空
    -   UNIQUE：唯一约束，规定某个字段在整个表中是唯一、不重复的
    -   PRIMARY KEY：主键约束，主键是一行数据的唯一标识，要求非空且唯一
    -   FOREIGN KEY：外键约束，用来让两张表的数据之间建立连接，保证数据的一致性和完整性
    -   CHECK（8.0.16版本之后）：检查约束，保证字段值满足某一个条件
    -   DEFAULT：默认值约束，保存数据时，如果未指定该字段的值，则采用默认值

约束是作用于表中字段上的，可以在建表时添加，可以在建表后添加或删除（ALTER、ADD、MODIFY）

**案例**

```sql
drop table if exists `user`;
create table `user`(
    id int primary key auto_increment, # 主键，并且自动增长
    name varchar(10) not null unique, # 不为空，并且唯一
    age int check (age>0 and age<=120), # 大于0，并且小于等于120
    status char(1) default 1, # 如果没有指定值，默认为1
    gender char(1) # 无约束
);
```

### 外键约束

外键用来让两张表的数据之间建立连接，从而保证数据的一致性和完整性

#### 语法

添加外键

```sql
# 建表时
create table 表名(
	字段名 数据类型,
    ...
    [constraint] [外键约束名] foreign key(外键字段名) references 主表(主表列名)
);
# 建表后
alter table 表名 add constraint 外键约束名 foreign key(外键字段名) references 主表(主表列名);
```

删除外键

```sql
alter table 表名 drop foreign key 外键约束名;
```

#### 删除/更新行为

| 行为        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| no action   | 当在父表中删除/更新对应记录时，如果该记录有对应外键则不允许删除/更新（与 restrict 一致） |
| restrict    | （与 no action 一致）                                        |
| cascade     | 当在父表中删除/更新对应记录时，自动删除/更新对应外键在子表中的记录 |
| set null    | 当在父表中删除/更新对应记录时，自动设置子表中对应外键值为null（要求该外键运行为null） |
| set default | 父表有变更时，子表将外键列设置成一个默认的值（Innodb不支持） |

```sql
alter table 表名 add constraint 外键约束名 foreign key(外键字段名) references 主表(主表列名)
on update cascade # 设置更新行为
on delete cascade; # 设置删除行为
```

## 多表查询

概述：指从多张表中查询数据

笛卡尔积：笛卡尔乘积是指在数学中，两个集合的所有组合情况。

==在多表查询时，需要消除无效的笛卡尔积==

分类：

-   连接查询
    -   内连接：相当于查询两张表交集部分的数据
    -   外连接
        -   左外连接：查询左表所有数据，以及两张表交集部分数据
        -   右外连接：查询右表所有数据，以及两张表交集部分数据
    -   自连接：当前表与自身的连接查询，自连接必须使用表别名
-   联合查询：把多次查询的结果合并起来，形成一个新的查询结果集。
-   子查询：SQL 语句中嵌套 select 语句，称为嵌套查询，又称子查询。

### 多表关系

-   一对一
    -   案例：用户与用户详情的关系
    -   关系：一对一关系，多用于单表拆分，将一张表的基础字段放在一张表中，其它详情字段放在另一张表中，以提升操作效率。
    -   实现：==在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的（UNIQUE）==
-   一对多
    -   案例：部门与员工的关系
    -   关系：一个部门对应多个员工，一个员工对应一个部门
    -   实现：==在多的一方建立外键，指向一的一方的主键==
-   多对多
    -   案例：学生与课程的关系
    -   关系：一个学生可以选修多门课程，一门课程也可以供多个学生选择
    -   实现：==建立第三张中间表，中间表至少包含两个外键，分别关联两方主键==

### 内连接

内连接查询两张表交集部分的数据

语法：

- 隐式内连接

  ```sql
  select 字段列表 from 表1,表2 where 条件...;
  ```

- 显示内连接

  ```sql
  select 字段列表 from 表1 [inner] join 表2 on 连接条件...;
  ```

### 外连接

查询左/右表所有数据，以及两张表交集部分数据

语法：

- 左外连接

  ```sql
  select 字段列表 from 表1 left [outer] join 表2 on 连接条件...;
  ```

- 右外连接

  ```sql
  select 字段列表 from 表1 right [outer] join 表2 on 连接条件...;
  ```

### 自连接

当前表与自身的连接查询，自连接必须使用表别名

语法：

```sql
select 字段列表 from 表名 别名A join 表名 别名B on 连接条件...;
```

自连接查询，可以是内连接查询，也可以是外连接查询

### 联合查询

对于 union 查询，就是把多次查询的结果合并起来，形成一个新的查询结果集。

```sql
select 字段列表 from 表A ...
union [all]
select 字段列表 from 表B ...;
```

==对于联合查询的多张表的列数必须保持一致，字段类型也需要保持一致==

==union all 会将全部的数据直接合并在一起，union 会对合并之后的数据去重==

### 子查询

SQL 语句中嵌套 select 语句，称为嵌套查询，又称子查询。

```sql
select * from t1 where column1 = (select column1 from t2);
```

==子查询外部的语句可以是 insert/update/delete/select 的任何一个。==

子查询分类：

-   根据子查询的结果不同：

    -   标量子查询（子查询结果为单个值）

    -   列子查询（子查询结果为一列）

    -   行子查询（子查询结果为一行）

    -   表子查询（子查询结果为多行多列）

-   根据子查询位置：where 之后、from 之后、select 之后

#### 标量子查询

标量子查询返回的结果是单个值（数字、字符串、日期等）

常用操作符：=、<>、>、>=、<、<=

1. 查询“销售部”的所有员工信息

   ```sql
   select * from emp
   where dept_id = (
   	select id from dept where name='销售部'
   );
   ```

2. 查询在“方东白”入职之后的员工信息

   ```sql
   select * from emp
   where entrydate > (
   	select entrydate from emp where name='方东白'
   );
   ```

#### 列子查询

列子查询返回的结果是一列多行

常用的操作符：in、not in、any、some、all

1. 查询“销售部”和“市场部”的所有员工信息

   ```sql
   select * from emp
   where dept_id in (select id from dept where name='销售部' or name='市场部');
   ```

2. 查询比“财务部”所有人工资都高的员工信息

   ```sql
   select * from emp
   where salary > all (
   	select salary from emp
       where dept_id = (select id from dept where name='财务部')
   );
   ```

3. 查询比“研发部”其中任意一人工资高的员工信息

   ```sql
   select * from emp
   where salary > any (
   	select salary from emp
       where dept_id = (select id from dept where name='研发部')
   );
   ```

#### 行子查询

行子查询返回的结果是一行多列

常用操作符：=、<>、in、not in

1. 查询与“张无忌”的薪资及直属领导相同的员工信息

   ```sql
   select * from emp
   where (salary,managerid) = (
   	select salary,managerid from emp where name='张无忌'
   );
   ```

#### 表子查询

表子查询返回的结果是多行多列

常用的操作符：in

1. 查询与“鹿杖客”，“宋远桥”的职位和薪资相同的员工信息

   ```sql
   select * from emp
   where (job,salary) in (
   	select job,salary from emp
       where name='鹿杖客' or name = '宋远桥'
   );
   ```

2. 查询入职日期是“2006-01-01”之后的员工信息，及其部门信息

   ```sql
   select e.*,d.* from (
   	select * from emp
       where entrydate > '2006-01-01'
   ) e left join dept d
   on e.dept_id = d.id;
   
   ```

## 事务

事务是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作==要么同时成功，要么同时失败==。

### 事务操作

方式一：

- 查看/设置事务的提交方式

  ```sql
  # 1 为自动提交，0 为手动提交
  select @@autocommit;
  set @@autocommit = 0;
  ```

- 提交事务

  ```sql
  commit;
  ```

- 回滚事务

  ```sql
  rollback;
  ```

方式二：

- 开启事务

  ```sql
  start transaction; 或者 begin;
  ```

- 提交事务

  ```sql
  commit;
  ```

- 回滚事务

  ```sql
  rollback;
  ```

### 事务四大特性

    1. 原子性（Atomicity）事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。
    2. 一致性（Consistency）事务前后数据的完整性必须保持一致。

  -   事务开始和结束时，外部数据一致
  -   在整个事务过程中，操作是连续的
      3. 隔离性（Isolation）多个用户并发访问数据库时，一个用户的事务不能被其它用户的事务所干扰，多个并发事务之间的数据要相互隔离。
      4. 持久性（Durability）一个事务一旦被提交，它对数据库中的数据改变就是永久性的。

### 并发事务问题

| 问题       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 脏读       | 一个事务读到另外一个事务还没有提交的数据。                   |
| 不可重复读 | 一个事务先后读取同一条记录，但两次读取的数据不同。           |
| 幻读       | 一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存在，好像出现了“幻影”。 |

### 事务隔离级别

| 隔离级别                        | 脏读 | 不可重复读 | 幻读 |
| ------------------------------- | ---- | ---------- | ---- |
| Read uncommitted 读未提交       | √    | √          | √    |
| Read committed 读已提交         | ×    | √          | √    |
| Repeatable Read（默认）可重复读 | ×    | ×          | √    |
| Serializable 串行化             | ×    | ×          | ×    |

```sql
# 查看事务隔离级别
select @@transaction_isolation;
# 设置事务隔离级别
set [session|global] transaction isolation level {read uncommitted|read committed|repeatable read|serializable}
```

>   注意：事务隔离级别越高，数据越安全，但是性能越低。



# 进阶

## 存储引擎

### MySQL 体系结构

- 连接层

  最上层是一些客户端和链接服务，主要完成一些类似于连接处理、授权认证、及相关的安全方案。服务器也会为安全接入的每个客户端验证它所具有的操作权限。

- 服务层

  第二层架构主要完成大多数的核心服务功能，如 SQL 接口，并完成缓存的查询，SQL 的分析和优化，部分内置函数的执行。所有跨存储引擎的功能也在这一层实现，如过程、函数等。

- 引擎层

  存储引擎真正的负责了 MySQL 中数据的存储和提取，服务器通过 API 和存储引擎进行通信。不同的存储引擎具有不同的功能，这样我们可以根据自己的需要，来选取合适的存储引擎。

- 存储层

  主要是将数据存储在文件系统之上，并完成与存储引擎的交互

### 存储引擎

存储引擎就是存储数据、建立索引、更新/查询数据等技术的实现方式。存储引擎是基于表的，而不是基于库的，所以存储引擎也可被称为表类型。

MySQL5.5 版本以后，默认建表存储引擎：InnoDB

```mysql
create table 表名(
) engine=innodb; # 可以更改存储引擎
```

```mysql
# 查询当前数据库支持的存储引擎
show engines;
```

### InnoDB

InnoDB 是一种兼顾高可靠性和高性能的通用存储引擎，在 MySQL 5.5 之后，InnoDB 是 MySQL 默认的存储引擎

-   DML 操作遵循 ACID 模型，支持事务；
-   行级锁，提高并发访问性能；
-   支持外键 foreign key 约束，保证数据的完整性和正确性；

**文件**

xxx.ibd：xxx代表的是表名，innoDB引擎的每张表都会对应这样一个表空间文件，存储该表的表结构（frm、sdi）、数据和索引。

参数：innodb_file_per_table

**逻辑存储结构**

-   TableSpace：表空间
-   Segment：段
-   Extent：区
-   Page：页
-   Row：行

### MyISAM

MyISAM 是 MySQL 早期的默认存储引擎

-   不支持事务，不支持外键
-   支持表锁，不支持行锁
-   访问速度快

**文件**

-   xxx.sdi：存储表结构信息
-   xxx.MYD：存储数据
-   xxx.MYI：存储索引

### Memory

Memory 引擎的表数据是存储在内存中的，由于受到硬件问题、或断电问题的影响，只能将这些表作为临时表或缓存使用。

-   内存存放
-   hash索引（默认）

**文件**

xxx.sdi：存储表结构信息

### 三种存储引擎的选择

-   InnoDB：是 MySQL 的默认存储引擎，支持事务、外键和行级锁。如果应用对事务的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询之外，还包含很多的更新、删除操作，那么 InnoDB 存储引擎是比较合适的选择
-   MyISAM：如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务的完整性、并发性要求不是很高，那么选择这个存储引擎是非常合适的。（==上位替代：MongoDB==）
-   MEMORY：将所有数据保存在内存中，访问速度快，通常用于临时表及缓存。Memory 的缺陷就是对表的大小有限制，太大的表无法缓存在内存中，而且无法保障数据的安全性。（==上位替代：Redis==）

## 索引



## SQL优化



## 视图



## 存储过程



## 触发器



## 锁



## InnoDB 引擎



## MySQL 管理



# 高级

## 日志



## 主从复制



## 分库分表



## 读写分离





主键裂缝问题：
	MySQL8之前自增主键的计数器维护在内存中，重启服务会重置计数器；
	MySQL8将自增主键的计数器持久化到重做日志中，重启服务会重新从日志中加载计数器；