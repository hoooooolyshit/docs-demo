### Docker

#### CentOS安装Docker

Docker 分为 CE 和 EE 两大版本。CE 即社区版（免费，支持周期 7 个月），EE 即企业版，强调安全，付费使用，支持周期 24 个月。Docker CE 分为 stable test 和 nightly 三个更新频道。 官方网站上有各种环境下的安装指南（[在 CentOS 上安装 Docker 引擎官网教程](https://docs.docker.com/engine/install/centos/)）。

这里主要介绍Docker CE 在 CentOS上的安装。

##### 1、前置准备

```bash
# 1、Docker 要求 CentOS 系统的内核版本高于 3.10 
uname -r # 查看你当前的内核版本
# 2、确保 yum 包更新到最新。
yum update -y
# 3、卸载旧版本(如果安装过旧版本的话)
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
# 4、安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
yum install -y yum-utils device-mapper-persistent-data lvm2
# 5、设置yum源
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo
```

##### 2、安装Docker

输入命令下载docker-ce社区免费版本。稍等片刻，docker即可安装成功。

```bash
yum install -y docker-ce
```

##### 3、启动Docker

Docker应用需要用到各种端口，逐一去修改防火墙设置。非常麻烦，因此建议大家直接关闭防火墙！

> 启动docker前，一定要关闭防火墙后！！

```bash
# 关闭防火墙
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
#查看是否关闭防火墙
systemctl status firewalld
```

通过命令启动Docekr服务

```bash
systemctl start docker  # 启动docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务
```

查看docker版本

```bash
docker -v
```

##### 4、配置仓库镜像

docker官方镜像仓库网速较差，我们需要设置国内镜像服务，[参考阿里云的镜像加速文档](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

```bash
# 创建文件夹
sudo mkdir -p /etc/docker
#在文件夹内新建一个daemon.json文件（25.8.12更新）
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.imgdb.de",
        "https://docker-0.unsee.tech",
        "https://docker.hlmirror.com"
    ]
}
EOF
# 重新加载文件
sudo systemctl daemon-reload
# 重启docker
sudo systemctl restart docker
```

到此Docker的安装就基本结束了

#### Docker常用命令

##### 镜像相关命令

```bash
# 查看自己服务器中docker 镜像列表
docker images
# 拉取镜像
docker pull 镜像名
docker pull 镜像名:tag
# 删除镜像
docker rmi -f 镜像名/镜像ID
# 使用镜像创建容器
docker run 镜像名/镜像ID
-d # 在后台运行
-p 宿主机端口:容器端口 # 端口映射
-v 宿主机目录:容器目录 # 目录映射（挂载卷）

```

##### 容器基础操作

```bash
# 查看所有运行中的容器的状态，不包括停止的
docker ps
# 查看所有容器的运行状态，包括运行的和停止的
docker ps -a
# 启动容器
docker start 容器名/容器ID
# 停止容器
docker stop 容器名/容器ID
# 删除容器
docker rm 容器名/容器ID
-f # 强制删除
# 重启容器
docker restart 容器名/容器ID
# 进入容器
docker exec -it 容器名/容器ID bash
```

##### 挂载卷操作

```bash
# 创建挂载卷
docker volume create 卷名
# 查看挂载卷信息
docker volume inspect 卷名
# 查看所有挂载卷
docker volume list
# 删除挂载卷
docker volume rm 卷名
```

##### 自定义镜像

Dockerfile：就是一个文本文件，其中使用指令来说明执行什么操作来构建镜像，Docker会根据Dockerfile中的指令来构建镜像。

所有指令可以参考官方文档，常用指令如下：

| 指令       | 说明                                         | 示例                            |
| ---------- | -------------------------------------------- | ------------------------------- |
| FROM       | 指定基础镜像                                 | FROM centos:7                   |
| ENV        | 设置环境变量，可在后面指令使用               | ENV key=value                   |
| COPY       | 拷贝本地文件到镜像的指定目录                 | COPY ./jdk17.tar.gz/tmp         |
| RUN        | 执行Linux的shell命令，一般是安装过程的命令   | RUN tar -zxvf /tmp/jdk17.tar.gz |
| EXPOSE     | 指定容器运行时监听的端口，是给镜像使用者看的 | EXPOSE 8080                     |
| ENTRYPOINT | 镜像中应用的启动命令，容器运行时调用         | ENTRYPOINT java -jar xx.jar     |

这里以`.jar`应用的Dockerfile文件为例：

```dockerfile
# 使用 CentOS 7 作为基础镜像
FROM centos:7

# 添加 JDK 到镜像中
COPY jdk17.tar.gz /usr/local/
RUN tar -xzf /usr/local/jdk17.tar.gz -C /usr/local/ &&  rm /usr/local/jdk17.tar.gz

# 设置环境变量
ENV JAVA_HOME=/usr/local/jdk-17.0.10
ENV PATH=$JAVA_HOME/bin:$PATH

#统一编码
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# 创建应用目录
RUN mkdir -p /app
WORKDIR /app

# 复制应用 JAR 文件到容器
COPY  ecms-admin.jar  app.jar

# 暴露端口
EXPOSE 8080

# 运行命令
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

编写好了Dockerfile之后，可以利用下面命令来构建镜像:

```shell
docker build -t myimage:1.0 目录
# -t：是给镜像起名，格式依然是repository:tag的格式，不指定tag时，默认为latest
# 目录：是指定Dockerfile所在目录，如果就在当前目录，则指定为"."
```

##### 网络

加入自定义网络的容器才可以通过容器名互相访问，Docker的网络操作命令如下:

| 命令                      | 说明                     |
| ------------------------- | ------------------------ |
| docker network create     | 创建一个网络             |
| docker network ls         | 查看所有网络             |
| docker network rm         | 删除指定网络             |
| docker network prune      | 清除未使用的网络         |
| docker network connect    | 使指定容器连接加入某网络 |
| docker network disconnect | 使指定容器连接离开某网络 |
| docker network inspect    | 查看网络详细信息         |

##### DockerCompose

Docker Compose通过一个单独的docker-compose.yml 模板文件(YAML 格式)来定义一组相关联的应用容器，帮助我们实现多个相互关联的Docker容器的快速部署。

安装docker compose

```bash
# 更新系统包
yum update -y

# 安装Docker Compose
yum install docker-compose-plugin -y
```

这里以Nginx镜像的部署为例，用Docker的原始命令部署是这样的：

```bash
docker run -d \
--name my-nginx \
-v /usr/local/app/html:/usr/share/nginx/html \
-v /usr/local/app/conf/nginx.conf:/etc/nginx/nginx.conf
-network mynetwork \
-p 80:80 \
nginx
```

用DockerCompose部署是这样的：

```yaml
services:
	my-nginx:
	image: "nginx"
	container_name: my-nginx
	volumes:
		- "/usr/local/app/html:/usr/share/nginx/html"
		- "/usr/local/app/conf/nginx.conf:/etc/nginx/nginx.conf"
	networks:
		- mynetwork
	ports:
		- "80:80"
networks:
	mynetwork:
		name: mynetwork
```

DockerCompose的命令格式：`docker compose [OPTIONS] [COMMANDS] -d`，最后-d的意思是在后台运行

```bash
# Options
-f # 指定compose文件的路径和名称，默认当前目录下的docker-compose.yml
-p # 指定project名称，默认是目录名-服务名
# Commands
up # 创建并启动所有service容器
down # 停止并移除所有容器、网络
ps # 列出所有启动的容器
logs # 查看指定容器的日志
stop # 停止容器
start # 启动容器
restart # 重启容器
top # 查看运行的进程
```







### Docker安装MySQL

#### Docker安装MySQL5.7

##### 1、前置准备

先创建3个目录，创建MySQL容器时会挂载容器的卷（Volume），用于Docker和宿主机（Centos）之间文件共享，包括配置文件、数据文件和日志文件。

```bash
# 使用 -p 创建多级目录，即 mydata 目录下创建 mysql 目录， mysql 目录下又创建 log 、data 、conf 三个目录；
# 注意：conf目录下要创建conf.d、mysql.conf.d两个目录；
mkdir -p /mydata/mysql/conf/conf.d
mkdir -p /mydata/mysql/conf/mysql.conf.d
mkdir -p /mydata/mysql/log
mkdir -p /mydata/mysql/data
```

##### 2、安装

拉取MySQL指定版本的镜像

```bash
docker pull mysql:5.7
```

输入Docker命令启动MySQL 5.7容器，这个命令将启动一个 MySQL 5.7 容器，将 MySQL 数据、日志和配置文件挂载到主机上的目录中，设置 MySQL 根密码，并允许容器在后台运行，以及在容器退出时自动重新启动。这是一个典型的用例，用于在 Docker 中运行 MySQL 数据库容器。

```bash
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
--restart=always \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
```

> docker run：这是 Docker 启动容器的命令。
> -p 3306:3306：这部分命令将主机的端口3306映射到容器内的3306端口。这样，您可以通过主机的3306端口来访问容器内运行的 MySQL 服务。
> --name mysql：通过此选项，您为容器指定了一个名称，即mysql。这使得容器更容易识别和管理。
> -v /mydata/mysql/log:/var/log/mysql：这是一个数据卷挂载操作，将主机上的`/mydata/mysql/log`目录挂载到容器内的`/var/log/mysql`目录。这样，MySQL 日志文件将在主机上存储，以供查看。
> -v /mydata/mysql/data:/var/lib/mysql：同样，这是另一个数据卷挂载操作，将主机上的`/mydata/mysql/data`目录挂载到容器内的`/var/lib/mysql`目录。这用于将 MySQL 数据文件保存在主机上，以便数据持久化。
> -v /mydata/mysql/conf:/etc/mysql：此挂载操作将主机上的`/mydata/mysql/conf`目录挂载到容器内的`/etc/mysql`目录。这样，您可以提供自定义的 MySQL 配置文件。
> --restart=always：这个选项指示 Docker 在容器退出时自动重新启动容器。这对于确保 MySQL 服务一直可用非常有用。
> -e MYSQL_ROOT_PASSWORD=123456：这个选项设置 MySQL 根用户的密码。在示例中，密码被设置为123456
> -d：这个选项使容器在后台运行，以允许您继续在终端中执行其他命令。
> mysql:5.7：这是要运行的 Docker 镜像的名称和标签。在此示例中，使用 MySQL 5.7 镜像。

##### 3、配置文件

在宿主机上新建自定义的 my.cnf 配置文件。 注意，在 /mydata/mysql/conf/ 目录下创建自定义的 my.cnf 配置文件。文件名随意，文件格式必须为 .cnf 。

```bash
vi /mydata/mysql/conf/my.cnf
```

添加容器运行的配置参数。使用的是**utf8mb4**编码而不是 utf8 编码。

```bash
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
init_connect="SET collation_connection = utf8mb4_unicode_ci"
init_connect="SET NAMES utf8mb4"
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
skip-character-set-client-handshake
skip-name-resolve
```

> 保存后，已经创建了一个名为`/mydata/mysql/conf/my.cnf`的 MySQL 配置文件。这个文件包含了一些 MySQL 的配置选项，用于配置 MySQL 服务器的字符集和排序规则等设置。让我解释一下这个配置文件的内容：
>
> - [client] 部分包含了 MySQL 客户端的配置，确保客户端使用 UTF-8 字符集。
> - [mysql] 部分也配置了 MySQL 客户端的默认字符集。
> - [mysqld] 部分包含了 MySQL 服务器的配置选项，用于配置 MySQL 服务器的行为。
>
> 以下是这个配置文件的各个配置选项的解释：
>
> - default-character-set=utf8mb4 和 default-character-set=utf8mb4：这两个选项在[client] 和 [mysql]部分都设置了默认字符集为 UTF-8，确保客户端和服务器使用相同的字符集。
> - init_connect='SET collation_connection = utf8mb4_unicode_ci' 和 init_connect='SET NAMES utf8mb4'：这些选项在[mysqld]部分设置了初始化连接时执行的 SQL 语句。这些语句设置了连接的字符集和排序规则为 UTF-8 和 utf8mb4_unicode_ci。
> - character-set-server=utf8mb4：这个选项设置了 MySQL 服务器的字符集为 UTF-8。
> - collation-server=utf8mb4_unicode_ci：这个选项设置了 MySQL 服务器的排序规则为 utf8mb4_unicode_ci，通常用于支持国际化和多语言字符的正确排序。
> - skip-character-set-client-handshake：这个选项用于禁用客户端字符集握手，允许客户端和服务器之间的字符集设置更加灵活。
> - skip-name-resolve：这个选项禁用了主机名解析，以提高连接性能。

它适用于确保 MySQL 以正确的字符集和排序规则处理数据。确保将这个配置文件用于启动 MySQL 服务器，可以通过 -v 选项将配置文件挂载到容器内。例如：

```bash
docker run -d -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
--restart=always \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
```

将在容器内使用自定义配置文件 `/mydata/mysql/conf/my.cnf` 来启动 MySQL 服务器。

##### 4、相关命令

```bash
# 查看日志
docker logs mysql
# 重启容器
docker restart mysql
# 进入容器
docker exec -it mysql bash
# 进入容器后：登录MySQL
mysql -h主机IP地址 -p3306 -uroot -p123456
# 进入容器后：退出MySQL
\q
# 进入容器后：退出容器
exit
```

##### 5、添加配置

- 修改容器中的MySQL时间不同步的问题
- 修改容器中的MySQL分组only_full_group_by问题
- 修改表名不区分大小写问题

在MySQL配置文件（通常是my.cnf）中，确保已正确配置时区。您可以在配置文件中添加以下内容：

```bash
[mysqld]
default_time_zone = '+8:00'
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
lower_case_table_names=1
```

这是一个 MySQL 配置文件（`my.cnf` 或 `my.ini`）中的一部分，用于设置数据库的默认时区、SQL 模式和其他选项。以下是这些选项的详细解释：

> default_time_zone = '+8:00'******：设置数据库的默认时区为 UTC+8。这意味着在执行与日期和时间相关的操作时，数据库将根据这个时区进行转换。**
> sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION******：设置 SQL 模式，以便更严格地遵循 SQL 标准。这有助于避免潜在的数据问题和错误。具体来说，这些模式包括：**STRICT_TRANS_TABLES******：禁止在严格模式下插入无效日期和数据。**
> NO_ZERO_IN_DATE******：禁止使用零日期（如 ‘0000-00-00’）。**
> NO_ZERO_DATE******：禁止使用零日期（如 ‘0000-00-00’）。**
> ERROR_FOR_DIVISION_BY_ZERO******：将除以零的操作视为错误，而不是警告。**
> NO_AUTO_CREATE_USER******：禁止自动创建用户。**
> NO_ENGINE_SUBSTITUTION******：如果请求的存储引擎不可用，禁止自动使用替代存储引擎。**
> lower_case_table_names = 1******：将所有表名存储为小写。这有助于避免因大小写不同而导致的表名混淆和错误。在某些操作系统（如 Windows 和 macOS）上，这个选项可能对大小写不敏感，而在其他操作系统（如 Linux）上可能对大小写敏感。设置为 1 表示启用该功能，0 表示禁用。**

#### Docker安装MySQL8

##### 1️⃣ 拉取官方镜像
首先，从Docker Hub获取MySQL 8官方镜像。
```bash
docker pull mysql:8
```
> 注：如果想使用特定版本（如8.0.20），将`8`替换为对应版本号即可。
>

##### 2️⃣ 运行MySQL容器

根据上述流程，你可以选择不同的方式运行容器。

**💻 简单测试部署**
如果仅用于测试，可直接运行一个基础容器：

```bash
docker run -d --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8
```
参数说明：
- `-d`：后台运行容器。
- `--name mysql8`：为容器命名。
- `-p 3306:3306`：将宿主机的3306端口映射到容器的3306端口。
- `-e MYSQL_ROOT_PASSWORD=123456`：设置MySQL的root用户密码。**请务必修改此密码**。

**🚀 生产环境配置**
对于生产环境，建议挂载数据和配置文件以**持久化数据**，并设置容器自启动。

1.  **创建目录和配置文件**
    在宿主机上创建用于挂载的目录和配置文件。
    
    ```bash
    mkdir -p /usr/mysql/{conf,data,logs}
    chmod -R 755 /usr/mysql/
    ```
    创建配置文件 `/usr/mysql/conf/my.cnf`。你可以根据需求配置，一个基础的示例如下：
    ```ini
    [client]
    default-character-set = utf8mb4
    
    [mysqld]
    datadir = /var/lib/mysql
    character_set_server = utf8mb4
    collation_server = utf8mb4_bin
    
    [mysql]
    default-character-set = utf8mb4
    ```
    
2.  **运行容器并挂载目录**
    使用以下命令运行容器，挂载宿主机目录并设置自启动：
    
    ```bash
    docker run -d \
      --name mysql8 \
      --restart=unless-stopped \
      -p 3306:3306 \
      -v /usr/mysql/conf/my.cnf:/etc/mysql/my.cnf \
      -v /usr/mysql/data:/var/lib/mysql \
      -v /usr/mysql/logs:/logs \
      -v /etc/localtime:/etc/localtime:ro \
      -e MYSQL_ROOT_PASSWORD=123456 \
      mysql:8
    ```
    关键参数说明：
    - `--restart=unless-stopped`：容器自动重启（除非手动停止）。
    - `-v /usr/mysql/data:/var/lib/mysql`：将容器内的MySQL数据目录挂载到宿主机，**实现数据持久化**。即使容器被删除，数据也不会丢失。
    - `-v /usr/mysql/conf/my.cnf:/etc/mysql/my.cnf`：挂载自定义配置文件。
    - `-v /etc/localtime:/etc/localtime:ro`：使容器时间与宿主机同步。

##### 3️⃣ 配置远程连接与安全
默认情况下，MySQL容器可能不允许远程连接。

1.  **进入容器并登录MySQL**
    ```bash
    docker exec -it mysql8 bash
    mysql -u root -p
    # 输入你设置的密码
    ```

2.  **授权远程访问**（谨慎操作）
    在MySQL命令行中，执行以下命令允许root用户从任意主机连接（`%`代表任意主机）：
    ```sql
    USE mysql;
    CREATE USER 'root'@'%' IDENTIFIED BY '123456';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```
    **安全提醒**：在生产环境中，为安全起见，最好**避免直接允许root用户远程访问**，而应创建专属用户并授权。

3.  **解决可能的加密方式错误**
    MySQL 8使用了新的默认身份认证插件`caching_sha2_password`，一些旧的客户端连接时可能报`2059`错误。可以修改用户的加密方式为`mysql_native_password`：
    ```sql
    ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '你的密码';
    FLUSH PRIVILEGES;
    ```

##### 4️⃣ 验证连接
使用MySQL客户端工具（如MySQL命令行客户端、Navicat、DBeaver等）连接测试。
- **主机**：宿主机IP地址（或`localhost`如果客户端在宿主机上）
- **端口**：`3306`（或你映射的其他宿主机端口）
- **用户名**：`root`
- **密码**：你设置的密码

##### 💎 核心配置要点总结

- **数据持久化是关键**：务必通过`-v`参数挂载数据目录（如`/var/lib/mysql`）到宿主机，防止容器删除时数据丢失。
- **配置文件挂载**：挂载自定义`my.cnf`文件可以更灵活地调整MySQL配置。
- **容器自启动**：使用`--restart`策略确保MySQL服务在宿主机重启后能自动运行。
- **连接安全**：谨慎配置远程访问权限，并注意MySQL 8的默认加密插件可能导致的连接问题。

如果在实际操作中遇到问题，可以查阅MySQL官方文档中关于Docker部署的章节。



### Docker安装Redis

#### 拉取Redis镜像

首先，我们需要从Docker Hub获取官方Redis镜像。

bash

```
# 拉取最新的Redis镜像[citation:1]
docker pull redis

# 或者，指定一个版本，例如7.4[citation:7]
docker pull redis:7.4
```

拉取完成后，可以使用 `docker images` 确认镜像是否存在。

#### 🚀 安装与配置Redis

你可以根据需求，选择快速启动或用于生产的配置方式。

##### 方案一：快速启动（适合测试）

这种方式最简单，但不适合生产环境，因为数据无法持久化。

```bash
docker run -d \
  --name my-redis \
  -p 6379:6379 \
  redis
```

> `-d`：后台运行容器。
>
> `--name`：为容器指定一个名字。
>
> `-p 6379:6379`：将宿主机的6379端口映射到容器的6379端口。

##### 方案二：生产环境配置（推荐）

为了数据的可靠性和安全性，我们需要配置持久化、密码并挂载外部配置文件。

1. **创建目录和配置文件**
   在宿主机上创建用于存放配置和数据的目录。

   ```bash
   # 创建配置目录和数据目录[citation:7]
   sudo mkdir -p /mydata/redis/data
   ```

2. **获取并修改配置文件**
   你可以从Redis官网下载默认的配置文件模板，然后进行修改。

   ```bash
   # 下载官方配置文件模板（以7.0版本为例）[citation:6]
   wget -O /mydata/redis/data/redis.conf https://raw.githubusercontent.com/redis/redis/7.0/redis.conf
   ```

   使用文本编辑器（如`vim`）修改 `/mydata/redis/data/redis.conf`，以下是一些关键配置项：

   ```bash
   # 允许所有IP访问（或注释掉bind行）
   bind 0.0.0.0
   # 关闭保护模式
   protected-mode no
   # 设置访问密码（请替换为你的强密码）
   requirepass yourpassword
   # 启用AOF持久化
   appendonly yes
   # 对于Docker环境，必须设置为非守护进程
   daemonize no
   ```

3. **启动Redis容器**
   使用以下命令，以挂载配置文件和数据目录的方式启动容器。

   ```bash
   docker run -d \
     --name redis \
     -p 6379:6379 \
     -v /mydata/redis/data/redis.conf:/etc/redis/redis.conf \
     -v /mydata/redis/data:/data \
     --restart always \
     redis \
     redis-server /etc/redis/redis.conf
   ```

   > `-v /mydata/redis/data/redis.conf:/etc/redis/redis.conf`：将宿主的配置文件挂载到容器内。
   >
   > `-v /mydata/redis/data:/data`：将数据目录挂载到宿主机，实现数据持久化。
   >
   > `--restart always`：设置容器随Docker服务自动重启。
   >
   > `redis-server /etc/redis/redis.conf`：指定使用容器内的配置文件启动Redis服务。

#### 🔧 基本操作与管理

容器运行后，你可以进行一些基本操作。

- **查看运行状态**

  ```bash
  docker ps -f name=redis
  ```

- **查看容器日志**

  ```bash
  docker logs redis
  ```

- **连接Redis并进行测试**
  使用以下命令进入容器并连接Redis客户端。

  ```bash
  docker exec -it redis redis-cli
  ```

  如果设置了密码，连接后需要进行认证。

  ```bash
  127.0.0.1:6379> auth 123456
  OK
  127.0.0.1:6379> set test "Hello Redis"
  OK
  127.0.0.1:6379> get test
  "Hello Redis"
  ```

- **停止和重启容器**

  ```bash
  # 停止容器
  docker stop redis
  # 重启容器
  docker restart redis
  ```

### Docker安装Nginx

#### 1️⃣ 拉取官方镜像
首先，从Docker Hub获取Nginx官方镜像。
```bash
docker pull nginx:latest
```
*注：如果想使用特定版本（如1.17.9），将`latest`替换为对应版本号即可。*

#### 2️⃣ 运行Nginx容器

根据上述流程，你可以选择不同的方式运行容器。

**💻 简单测试部署**
如果仅用于测试，可直接运行一个基础容器：
```bash
docker run -d --name my-nginx -p 80:80 nginx:latest
```
参数说明：
- `-d`：后台运行容器。
- `--name my-nginx`：为容器命名。
- `-p 80:80`：将宿主机的80端口映射到容器的80端口。

**🚀 生产环境配置**
对于生产环境，建议挂载配置文件和静态资源目录以**持久化数据**。

1.  **创建目录结构**
    在宿主机上创建用于挂载的目录。
    ```bash
    mkdir -p /data/nginx/{html,conf,logs}
    ```

2.  **准备自定义网页和配置**
    创建测试网页：
    ```bash
    echo "Hello from Nginx!" > /data/nginx/html/index.html
    ```
    创建Nginx配置文件`/data/nginx/conf/default.conf`，基础示例如下：
    ```nginx
    server {
        listen       80;
        server_name  localhost;
        root   /usr/share/nginx/html;
        index  index.html;
        
        access_log  /var/log/nginx/access.log;
        error_log   /var/log/nginx/error.log;
        
        location / {
            try_files $uri $uri/ =404;
        }
    }
    ```

3.  **运行容器并挂载目录**
    使用以下命令运行容器并挂载宿主机目录：
    ```bash
    docker run -d \
      --name my-nginx \
      -p 80:80 \
      -v /data/nginx/html:/usr/share/nginx/html \
      -v /data/nginx/conf:/etc/nginx/conf.d \
      -v /data/nginx/logs:/var/log/nginx \
      nginx:latest
    ```
    关键参数说明：
    - `-v /data/nginx/html:/usr/share/nginx/html`：挂载网页目录。
    - `-v /data/nginx/conf:/etc/nginx/conf.d`：挂载配置文件目录。
    - `-v /data/nginx/logs:/var/log/nginx`：挂载日志目录。

#### 3️⃣ 使用Docker Compose部署
对于复杂应用，使用`docker-compose.yml`能更高效地管理服务。

1.  **创建`docker-compose.yml`文件**：
    ```yaml
    version: '3'
    services:
      nginx:
        image: nginx:latest
        container_name: nginx-service
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./html:/usr/share/nginx/html
          - ./conf:/etc/nginx/conf.d
          - ./logs:/var/log/nginx
        restart: always
    ```

2.  **启动服务**
    在`docker-compose.yml`所在目录执行：
    ```bash
    docker compose up -d
    ```

#### 4️⃣ 配置反向代理
Nginx作为反向代理是其核心功能之一。例如，将请求转发到后端应用容器。
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://app-container:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
*注：确保后端应用容器`app-container`与Nginx在同一个Docker网络中，或使用`--link`连接。*

### 🔧 验证与管理

#### ✅ 验证服务状态
- **检查容器状态**：
  ```bash
  docker ps
  ```
  若STATUS列显示`Up`，说明容器正常运行。

- **访问测试**：
  浏览器访问`http://你的服务器IP`，应显示自定义网页或Nginx默认页。

- **查看容器日志**：
  ```bash
  docker logs my-nginx
  ```

#### ⚠️ 常见问题处理

- **端口冲突**：如果宿主机80端口已被占用，可改用其他端口，例如`-p 8080:80`。
- **权限问题**：若容器启动失败，尝试在`docker run`命令中添加`--privileged=true`。
- **配置更新**：修改配置文件后，重启容器使配置生效：
  ```bash
  docker restart my-nginx
  ```

### 💎 核心配置要点总结

- **数据持久化是关键**：务必通过`-v`参数挂载配置、网页和日志目录。
- **灵活映射端口**：根据实际情况映射端口，避免冲突。
- **善用反向代理**：充分利用Nginx的反向代理和负载均衡功能。
- **日志管理**：挂载日志目录便于问题排查和日志轮转。











Docker部署.jar



```bash
docker build -t myimage:1.0 .
docker run -d --name backend -p 8080:8080 --network test-network myimage:1.0
```



```dockerfile
# 使用 CentOS 7 作为基础镜像
FROM centos:7

# 安装完整的字体支持
# 使用阿里云镜像源安装字体库
RUN curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo && \
    yum makecache && \
    yum install -y fontconfig freetype && \
    yum clean all

# 创建字体缓存
RUN fc-cache -f -v

# 添加 JDK 到镜像中
COPY jdk17.tar.gz /usr/local/
RUN tar -xzf /usr/local/jdk17.tar.gz -C /usr/local/ &&  rm /usr/local/jdk17.tar.gz

# 设置环境变量
ENV JAVA_HOME=/usr/local/jdk-17.0.10
ENV PATH=$JAVA_HOME/bin:$PATH

#统一编码
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# 创建应用目录
RUN mkdir -p /ecms
WORKDIR /ecms

# 复制应用 JAR 文件到容器
COPY  ecms-admin.jar  ecms-admin.jar

# 暴露端口
EXPOSE 8080

# 运行命令
ENTRYPOINT ["java","-jar","/ecms/ecms-admin.jar"]
```



```bash
docker run -d \
  --name nginx-test \
  --network test-network \
  -p 80:80 \
  -v /root/test/frontend/dist:/usr/share/nginx/html \
  -v /root/test/frontend/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```



```nginx

#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        client_max_body_size 10m;
        
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location ^~ /prod-api/ {
			rewrite ^/prod-api/(.*)$ /$1 break;
			proxy_pass http://backend:8080;
        }
    }

}

```

