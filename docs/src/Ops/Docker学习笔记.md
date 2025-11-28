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







# 镜像操作命令

查看本地镜像

```bash
docker images
```

搜索镜像

```bash
docker search 镜像名
docker search --filter=STARS=9000 mysql # 搜索stars大于9000的mysql镜像
```

拉取镜像（不加 tag 即拉取 docker 仓库中 该镜像的最新版本 latest，加 :tag 则是拉取指定版本）

```bash
docker pull 镜像名 
docker pull 镜像名:tag
```

删除镜像（当前镜像没有被任何容器使用才可以删除）

```bash
# 删除一个
docker rmi -f 镜像名/镜像ID

# 删除多个 其镜像ID或镜像用用空格隔开即可 
docker rmi -f 镜像名/镜像ID 镜像名/镜像ID 镜像名/镜像ID

# 删除全部镜像  -a 意思为显示全部, -q 意思为只显示ID
docker rmi -f $(docker images -aq)

# 强制删除镜像
docker image rm 镜像名称/镜像ID
```


-   `docker push`推送镜像
-   `docker save`保存镜像
-   `docker load`加载镜像

# 容器相关命令

-   `docker run`创建并运行容器
-   `docker logs`查看容器日志
-   `docker ps`查看容器状态
-   `docker rm`删除容器
-   `docker exec -it [容器名] [要执行的命令]`进入容器