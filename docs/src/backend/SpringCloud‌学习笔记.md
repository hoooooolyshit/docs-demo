# 实用篇

## ==day01== ==微服务治理==

## 认识微服务

## 简单的服务拆分和远程调用

访问MySQL8时，url要加上`&allowPublicKeyRetrieval=true`配置项

RestTemplate实现远程调用

服务提供者、服务消费者

## Eureka注册中心

搭建eureka服务、服务注册和服务发现

负载均衡

## Ribbon负载均衡

负载均衡原理、负载均衡策略、饥饿加载

## Nacos注册中心

下载nacos，命令行启动nacos，`startup.cmd -m standalone`(代表非集群模式)启动nacos

添加nacos客户端依赖（`spring-cloud-starter-alibaba-nacos-discovery`），配置nacos服务端地址

配置nacos集群属性，实现nacos服务多级存储（服务->集群->实例）

配置负载均衡规则：com.alibaba.cloud.nacos.ribbon.NacosRule，实现优先访问本地集群，默认随机规则

nacos控制台设置实例的权重

nacos环境隔离

配置临时实例和非临时实例

## ==day02== ==微服务治理==

## Nacos配置管理

### 微服务配置拉取

spring配置获取的步骤：项目启动 -> bootstrap.yml（nacos地址）-> 读取nacos中配置文件 -> 读取本地配置文件application.yml -> 创建spring容器 -> 加载bean

1.  在Nacos服务端的配置管理中添加配置文件
2.  引入Nacos的客户端配置管理依赖（`spring-cloud-starter-alibaba-nacos-config`）
3.  添加bootstrap.yml文件，配置nacos地址、当前环境、服务名称、文件后缀名。这些决定了程序启动时去nacos读取哪个配置文件，这个文件是引导文件，优先级高于application.yml

配置自动刷新（热更新）方式一：@Value结合@RefreshScope；方式二：`@ConfigurationProperties`注入（推荐）

### 多环境共享配置

多种配置的优先级：服务名-profile.yaml > 服务名.yaml > 本地配置

### Nacos集群搭建

1.  搭建MySQL集群并初始化数据库表
2.  修改nacos集群配置（节点信息）、数据库配置
3.  分别启动多个nacos节点
4.  nginx反向代理

## Feign远程调用

### Feign替代RestTemplate

1.  添加feign客户端依赖
2.  启动类添加注解`@EnableFeignClients`开启Feign自动装配
3.  编写UserClient接口并添加注解`@FeignClient("userservice")`，指定服务名称、url地址、参数以及请求方式
4.  注入接口，调用方法完成远程调用

Feign继承了Ribbon，自动实现了负载均衡

### 自定义配置

方式一：配置文件方式

方式二：Java代码方式

### Feign使用优化

-   使用连接池代替默认的URLConnection
    1.  引入`feign-httpClient`依赖
    2.  配置文件开启httoClient功能，设置连接池参数
-   日志级别，最好用basic或none

### 最佳实践

方式一（继承）：给消费者的FeignClient和提供者的controller定义统一的父接口作为标准

方式二（抽取）：将FeignClient抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有消费者使用

## Gateway服务网关

### 网关的作用

-   身份认证和权限检验
-   服务路由、负载均衡
-   请求限流

### gateway快速入门

1.  创建新的module，引入`spring-cloud-starter-gateway`网关依赖和`spring-cloud-starter-alibaba-nacos-discovery`nacos服务发现依赖
2.  编写路由配置及nacos地址等

路由配置包括：路由id、路由目标（uri）、路由断言（predicates）、路由过滤器（filters）

### 断言工厂

断言（predicate）是编程术语，表示为一些布尔表达

路由断言工厂（Route Predicate Factory）：读取配置文件中的断言规则字符串，处理并转变为路由判断的条件。

Spring提供了11种基本的Predicate工厂

### 过滤器工厂

请求进入网关会碰到三类过滤器：

-   当前路由的过滤器（filters）
-   默认过滤器（default-filters）
-   全局过滤器（GlobalFilter）

请求路由后会将三类过滤器合并到一个过滤器链（集合）中，排序后依次执行。

过滤器工厂（Gateway Fileter Factory）

Spring提供了31种不同的路由过滤器工厂

### 跨域问题

跨域：域名不一致就是跨域，主要包括域名不同或端口不同

跨域问题：浏览器禁止请求的发起者于服务端发生跨域ajax请求，请求被浏览器拦截的问题

网关处理跨域问题：采用CORS方案，简单配置即可实现

```yaml
spring:
  cloud:
    gateway:
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求
              - "http://localhost:8090"
              - "http://www.leyou.com"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```

## ==day03== ==打包与部署==

## Docker

### 初识Docker

Docker是一个快速交付应用、运行应用的技术

**Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？**

-   Docker将应用的Libs（函数库）、Deps（依赖）、配置与应用一起打包，形成可移植镜像
-   Docker应用运行在容器中，使用沙箱机制，相互隔离

**Docker如何解决开发、测试、生产环境有差异的问题？**

-   Doker将用户程序与所需要调用的系统（比如Ubuntu）函数库一起打包，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行

**镜像和容器**

镜像（Image）：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像。

容器（Container）：镜像中的应用程序运行后形成的进程就是容器，只是Docker会给容器做隔离，对外不可见。

**Docker和DockerHub**

-   DockerHub：一个Docker镜像的托管平台。这样的平台称为Docker Registry
-   国内也有类似于DockerHub的公开服务，比如网易云镜像服务、阿里云镜像库等。

**Docker架构**

Docker是一个CS架构的程序，由两部分组成：

-   服务端（server）：接收命令或远程请求，操作镜像或容器
-   客户端（client）：发送命令或请求传到Docker服务端

### Docker的安装

详见文档

### Docker的基本操作

**镜像操作命令**

-   `docker images`查看本地镜像
-   `docker rmi`
-   `docker pull`
-   `docker push`
-   `docker save`
-   `docker load`

**容器相关命令**

-   `docker run`创建并运行容器
-   `docker logs`查看容器日志
-   `docker ps`查看容器状态
-   `docker rm`删除容器
-   `docker exec -it [容器名] [要执行的命令]`进入容器

**数据卷**

数据卷（volume）是一个虚拟目录，指向宿主机文件系统中的某个目录

数据卷操作命令：`docker volume [命令]`

### Dockerfile自定义镜像

**Dockerfile**就是一个文本文件，其中包含一个个的**指令**，用指令来说明要执行什么操作来构建镜像。每一个指令都会形成一层Layer。

```
# 指定基础镜像
FROM java:8-alpine
# 拷贝java项目的包
COPY ./docker-demo.jar /tmp/app.jar
# 暴露端口
EXPOSE 8090
# 入口，java项目的启动命令
ENTRYPOINT java -jar /tmp/app.jar
```

### Docker-Compose

==Docker Compose==可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器

==Compose文件==是一个文本文件，通过指令定义集群中的每个容器如何运行（实际上就是将docker run指令的各种参数转换成了对应的配置）

DockerCompose的详细语法参考官网：https://docs.docker.com/compose/compose-file/

DockerCompose的安装详见文档

**DockerCompose部署微服务集群**

### Docker镜像仓库

**搭建Docker私有镜像仓库**

参考文档



## ==day04== ==服务异步通讯==

## RabbitMQ

### 初识MQ

**同步调用和异步调用**

同步调用（如Feign）时效性强，但是存在很多问题

异步调用常见的实现就是事件驱动模式（Broker）

**什么是MQ**

MQ（MessageQueue）消息队列，存放消息的队列。也就是事件驱动架构中的Broker

RabbitMQ、ActiveMQ、RocketMQ、Kafka等

### RabbitMQ快速入门

**安装**

参考文档 RabbitMQ部署指南.md

**RabbitMQ种的几个概念**

-   channel：操作MQ的工具
-   exchange：路由消息到队列中
-   queue：缓存消息
-   virtual host：虚拟主机，是对queue、exchange等资源的逻辑分组

**官方文档提供了 5 个MQ的Demo实例**

### 简单队列模型

**基本消息队列的消息发送流程：**

1.  建立connection
2.  创建channel
3.  利用channel声明队列
4.  利用channel向队列发送消息

**基本消息队列的消息接收流程：**

1.  建立connection
2.  创建channel
3.  利用channel声明队列
4.  定义consumer的消费行为handleDelivery()
5.  利用channel将消费者与队列绑定（回调函数）

## SpringAMQP

Spring AMQP是基于AMQP协议定义的一套API规范，提供了模板来发送和接收消息。包含两部分，其中spring-amqp是基础抽象，spring-ribbit是底层的默认实现

### Simple Queue 简单队列模型

**消息发送流程**

**消息接收流程**

### Work Queue 工作队列

-   多个消费者绑定到一个队列，同一条消息只会被一个消费者处理
-   通过设置prefetch来控制消费者预取的消息数量

### 发布订阅模型

发布订阅模式允许将同一消息发送给多个消费者，实现方式是加入了exchange（交换机）

**常见的exchange类型包括**

-   Fanout：广播
-   Direct：路由
-   Topic：话题

**Fanout Exchange**

Fanout Exchange会将接收到的消息路由到每一个跟其绑定的queue

**Direct Exchange**

Direct Exchange会将接收到的消息根据规则路由到指定的queue，因此称为路由模式（routes）

**Topic Exchange**

Topic Exchange与Direct Exchange类似，区别在于routingKey必须是多个单词的列表，并且以`.`分割

queue与exchange指定BindingKey时可以使用通配符

**消息转换器**

SpringAMQP中消息的序列化和反序列化是利用`MessageConverter`实现的，默认是JDK的序列化，推荐使用JSON的序列化。注意发送方与接收方必须使用相同的MessageConverter

## ==day05== ==分布式搜索==

## 初识elasticsearch

### 了解ES

**elasticsearch**

一个开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

**elastic stack（ELK）**

是以elasticsearch为核心的技术栈，包括beats、Logstash、kibana、elasticsearch

**Lucene**

是Apache的开源搜索引擎类库，提供了搜索引擎的核心API

### 正向索引和倒排索引

**文档和词条**

-   每一条数据就是一个文档
-   对文档中的内容分词，得到的词语就是词条

**正向索引**

基于文档 id 创建索引。查询词条时必须先找到文档，然后判断是否包含词条

**倒排索引**

对文档内容分词，对词条创建索引，并记录词条所在文档的信息。查询时先根据词条查询到文档 id，而后获取到文档

### es的一些概念

**文档和字段**

文档：一条数据就是一个文档，es中时json格式

字段：json文档中的字段

**索引和映射**

索引：相同类型的文档的集合

映射：索引中文档的约束，比如字段名称、类型

**mysql与elasticsearch概念对比**

| **MySQL** | **Elasticsearch** | **说明**                                                     |
| --------- | ----------------- | ------------------------------------------------------------ |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)           |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是JSON格式 |
| Column    | Field             | 字段（Field），就是JSON文档中的字段，类似数据库中的列（Column） |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema） |
| SQL       | DSL               | DSL是elasticsearch提供的JSON风格的请求语句，用来操作elasticsearch，实现CRUD |

-   数据库负责事务类型操作
-   elasticsearch负责海量数据的搜索、分析、计算

### 安装es、kibana

参考资料

### 分词器

**作用**

- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

**IK分词器的两种模式**

- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

**IK分词器拓展词条、停用词条**

- 利用config目录的IkAnalyzer.cfg.xml文件添加拓展词典和停用词典
- 在词典中添加拓展词条或者停用词条

## 索引库操作

索引库就类似数据库表，mapping映射就类似表的结构。

我们要向es中存储数据，必须先创建“库”和“表”。

### mapping映射属性

mapping是对索引库中文档的约束

**常见的mapping属性包括：**

- type：字段数据类型
- index：是否创建索引，默认为true
- analyzer：使用哪种分词器
- properties：该字段的子字段

**常见的type简单类型**

- 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、ip地址）
- 数值：long、integer、short、byte、double、float、
- 布尔：boolean
- 日期：date
- 对象：object

### 索引库的CRUD

**创建索引库**

- 请求方式：PUT
- 请求路径：/索引库名，可以自定义
- 请求参数：mapping映射

**查询索引库**

- 请求方式：GET
- 请求路径：/索引库名
- 请求参数：无

**修改索引库**

索引库和mapping一旦创建无法修改，但是可以添加新的字段

```json
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名":{
      "type": "integer"
    }
  }
}
```

**删除索引库**

- 请求方式：DELETE

- 请求路径：/索引库名

- 请求参数：无

## 文档操作

### 创建文档

POST /{索引库名}/_doc/文档id   { json文档 }

### 查询文档

GET /{索引库名}/_doc/文档id

### 删除文档

DELETE /{索引库名}/_doc/文档id

### 修改文档

**全量修改**

PUT /{索引库名}/_doc/文档id { json文档 }

**增量修改**

POST /{索引库名}/_update/文档id { "doc": {字段}}

## RestAPI

ES官方提供了各种不同语言的客户端，用来操作ES。这些客户端的本质就是组装DSL语句，通过http请求发送给ES。官方文档地址：https://www.elastic.co/guide/en/elasticsearch/client/index.html

其中的Java Rest Client又包括两种：

- Java Low Level Rest Client
- Java High Level Rest Client



## ==day06== ==分布式搜索==





## ==day07== ==分布式搜索==





# 高级篇

## ==day01== ==微服务保护==

## 初识Sentinel

### 雪崩问题

微服务之间相互调用，因为调用链中的一个服务故障，引起整个链路都无法访问的情况。

**解决方案**

-   超时处理
-   舱壁模式（线程隔离）
-   熔断降级

-   流量控制（限流）

==流量控制==是对服务的保护，避免因瞬间高并发流量而导致服务故障，进而避免雪崩。是一种==预防==措施。

==超时处理、线程隔离、降级熔断==是在部分服务故障时，将故障控制在一定范围，避免雪崩。是一种==补救==措施。

### 服务保护技术对比

在SpringCloud当中支持多种服务保护技术：

- [Netfix Hystrix](https://github.com/Netflix/Hystrix)
- [Sentinel](https://github.com/alibaba/Sentinel)
- [Resilience4J](https://github.com/resilience4j/resilience4j)

早期比较流行的是Hystrix框架，但目前国内实用最广泛的还是阿里巴巴的Sentinel框架，这里我们做下对比：

|                | **Sentinel**                                   | **Hystrix**                   |
| -------------- | ---------------------------------------------- | ----------------------------- |
| 隔离策略       | 信号量隔离                                     | 线程池隔离/信号量隔离         |
| 熔断降级策略   | 基于慢调用比例或异常比例                       | 基于失败比率                  |
| 实时指标实现   | 滑动窗口                                       | 滑动窗口（基于 RxJava）       |
| 规则配置       | 支持多种数据源                                 | 支持多种数据源                |
| 扩展性         | 多个扩展点                                     | 插件的形式                    |
| 基于注解的支持 | 支持                                           | 支持                          |
| 限流           | 基于 QPS，支持基于调用关系的限流               | 有限的支持                    |
| 流量整形       | 支持慢启动、匀速排队模式                       | 不支持                        |
| 系统自适应保护 | 支持                                           | 不支持                        |
| 控制台         | 开箱即用，可配置规则、查看秒级监控、机器发现等 | 不完善                        |
| 常见框架的适配 | Servlet、Spring Cloud、Dubbo、gRPC  等         | Servlet、Spring Cloud Netflix |

### Sentinel介绍和安装

Sentinel是阿里巴巴开源的一款微服务流量控制组件。官网地址：https://sentinelguard.io/zh-cn/index.html

Sentinel安装参考资料

### 微服务整合Sentinel

1.  引入Sentinel依赖
2.  配置Sentinel控制台地址
3.  访问微服务的任意端点，触发Sentinel监控

## 流量控制

簇点链路

流控模式

流控效果

热点参数限流

## 隔离和降级

## 授权规则

## 规则持久化

## ==day02== ==分布式事务==

## 分布式事务

分布式事务，就是指不是在单个服务或单个数据库架构下，产生的事务

## 理论基础

## 初识Seata

## 动手实践

## 高可用



## ==day03== ==分布式缓存==

Redis集群





## ==day04== ==多级缓存==





## ==day05== ==服务异步通讯==

RabbitMQ的高级特性



# 面试篇

## 微服务篇



## MQ篇



## Redis篇