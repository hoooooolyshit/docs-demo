# CentOS 安装 Docker

Docker 是一个开源的应用容器引擎，允许开发者将应用及其依赖打包到一个可移植的容器中。Docker 分为 CE（社区版）和 EE（企业版）两大版本：

- **CE（社区版）**：免费使用，提供为期 7 个月的支持周期
- **EE（企业版）**：强调安全性，需付费使用，提供 24 个月的支持周期

Docker CE 提供三个更新频道：
- `stable` - 稳定版
- `test` - 测试版  
- `nightly` - 每日构建版

> 💡 **官方参考**：[在 CentOS 上安装 Docker 引擎](https://docs.docker.com/engine/install/centos/)

## 环境准备

### 系统要求
- CentOS 7 或更高版本
- 内核版本 3.10 及以上
- 建议使用全新系统环境

### 前置操作步骤

```bash
# 1. 检查当前内核版本
uname -r

# 2. 更新系统包到最新版本
yum update -y

# 3. 卸载旧版本 Docker（如已安装）
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

# 4. 安装依赖包
yum install -y yum-utils device-mapper-persistent-data lvm2

# 5. 配置 yum 源（使用阿里云镜像）
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo
```

## Docker 安装

### 安装 Docker CE

```bash
# 安装 Docker Community Edition
yum install -y docker-ce

# 或者安装特定版本（可选）
# yum list docker-ce --showduplicates | sort -r  # 查看可用版本
# yum install -y docker-ce-<VERSION_STRING>      # 安装指定版本
```

## Docker 服务管理

### 防火墙配置
> ⚠️ **重要提示**：Docker 需要使用大量端口，为避免端口冲突，建议关闭防火墙

```bash
# 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

# 验证防火墙状态
systemctl status firewalld
```

### Docker 服务操作

```bash
# 验证安装（查看版本）
docker --version

# 启动 Docker 服务
systemctl start docker

# 设置开机自启
systemctl enable docker

# 停止 Docker 服务
systemctl stop docker

# 重启 Docker 服务
systemctl restart docker

# 查看 Docker 状态
systemctl status docker
```

## 镜像加速配置

### 配置国内镜像源
由于 Docker 官方镜像仓库访问较慢，建议配置国内镜像加速器：

```bash
# 创建配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器（2024年8月更新）
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

# 重新加载配置
sudo systemctl daemon-reload

# 重启 Docker 服务
sudo systemctl restart docker
```

> 🔍 **其他可选镜像**：
> - 阿里云镜像：需在[容器镜像服务控制台](https://cr.console.aliyun.com/)获取专属加速地址
> - 中科大镜像：`https://docker.mirrors.ustc.edu.cn`
> - 网易镜像：`https://hub-mirror.c.163.com`

## 安装验证

### 基础功能测试

```bash
# 运行测试容器
docker run hello-world

# 查看 Docker 系统信息
docker info

# 查看镜像列表
docker images

# 查看容器状态
docker ps -a
```

### 常用命令验证
```bash
# 拉取并运行 Nginx 测试
docker run -d -p 80:80 --name test-nginx nginx

# 查看运行中的容器
docker ps

# 停止测试容器
docker stop test-nginx

# 删除测试容器
docker rm test-nginx
```

## 故障排查

### 常见问题解决

**问题1：权限不足**
```bash
# 将当前用户加入 docker 组
sudo usermod -aG docker $USER
# 重新登录或执行以下命令生效
newgrp docker
```

**问题2：端口冲突**

```bash
# 查看端口占用情况
netstat -tulpn | grep :端口号
```

**问题3：存储驱动问题**

```bash
# 查看存储驱动信息
docker info | grep "Storage Driver"
```

## 总结

至此，Docker 已在 CentOS 系统上成功安装并配置完成。您现在可以：

- 🐳 使用 Docker 运行容器化应用
- 📦 从 Docker Hub 拉取镜像
- 🔧 开始您的容器化开发之旅

> 💡 **提示**：生产环境请根据实际需求调整安全配置，不建议直接关闭防火墙。