# JavaWeb



## 1 JavaWeb 的概念

### a）什么是 JavaWeb

JavaWeb 是指，所有通过 Java 语言编写可以通过浏览器访问的程序的总称。

JavaWeb 是基于请求和响应来开发的。



### b）什么是请求

请求是指客户端给服务器发送数据，叫请求 Request。



### c）什么是响应

响应是指服务器给客户端回传数据，叫响应 Response。



### d）请求和响应的关系

请求和响应是成对出现的，有请求就有响应。



## 2 Web 资源的分类

web 资源按实现的技术和呈现的效果不同，又分为静态资源和动态资源两种

- 静态资源：html、css、js、txt、mp4 视频、jpg 图片
- 动态资源：jsp 页面、Servlet 程序



## 3 常用的 Web 服务器

- **Tomcat**
- **jboss**
- **GlassFish**
- **Resin**
- **WebLogic**



## 4 Tomcat 服务器和 Servlet 版本的对应关系



## 5 Tomcat 的使用

### a）安装

找到你需要用的 Tomcat 版本对应的 zip 压缩包，解压到需要安装的目录即可。



### b）目录介绍

- **bin：**专门用来存放 Tomcat 服务器的可执行程序
- **conf：**专门用来存放 Tomcat 服务器的配置文件



## 6 Servlet 技术

### a）什么是 Servlet

1. Servlet 是 javaEE 规范之一。规范就是接口
2. Servlet 是 JavaWeb 三大组件之一。三大组件分别是：Servlet 程序、Filter 过滤器、Listener 监听器
3. Servlet 是运行在服务器上的一个 java 小程序，==它可以接收客户端发送过来的请求，并响应数据给客户端==



### b）手动实现 Servlet 程序

1. 编写一个类去实现 Servlet 接口
2. 实现 servlet 方法，处理请求，并响应数据
3. 到 web.xml 中去配置 servlet 程序的访问地址

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- servlet标签给Tomcat配置Servlet程序 -->
    <servlet>
        <!-- servlet-name标签给Servlet程序起一个别名（一般是类名） -->
        <servlet-name>HelloServlet</servlet-name>
        <!-- servlet-class是Servlet程序的全类名 -->
        <servlet-class>com.donouee.servlet.HelloServlet</servlet-class>
    </servlet>

    <!-- servlet-mapping标签给Servlet程序配置访问地址 -->
    <servlet-mapping>
        <!-- servlet-name标签的作用是告诉服务器，我当前配置的地址给哪个Servlet程序使用 -->
        <servlet-name>HelloServlet</servlet-name>
        <!-- url-pattern标签配置访问地址
             / 斜杠在服务器解析的时候，表示地址为：http://ip:port/工程路径
             /hello 表示地址为：http://ip:port/工程路径/hello
        -->
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>

</web-app>
```



### c）url 地址到 Servlet 程序的访问

"C:\Users\72819\AppData\Roaming\Typora\typora-user-images\image-20210920090735406.png" alt="image-20210920090735406"

