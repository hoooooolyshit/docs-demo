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