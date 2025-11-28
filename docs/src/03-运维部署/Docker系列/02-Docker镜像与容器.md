# Docker镜像与容器

## 镜像管理

### 基础操作

```bash
# 查看本地镜像列表
docker images
docker image ls

# 拉取镜像
docker pull <image_name>
docker pull <image_name>:<tag>

# 搜索镜像
docker search <image_name>

# 删除镜像
docker rmi <image_name/image_id>
docker rmi -f <image_name/image_id>  # 强制删除

# 查看镜像详情
docker inspect <image_name/image_id>

# 查看镜像历史
docker history <image_name/image_id>

# 清理无用镜像
docker image prune
docker image prune -a  # 删除所有无用镜像
```

### 镜像构建与导出

```bash
# 构建镜像
docker build -t <repository>:<tag> <context_directory>
docker build -t myapp:1.0 .

# 标记镜像
docker tag <source_image> <new_repository>:<new_tag>

# 保存镜像为文件
docker save -o <filename>.tar <image_name>

# 从文件加载镜像
docker load -i <filename>.tar

# 导出容器为镜像
docker commit <container_id> <new_image_name>
```

## 容器管理

### 容器生命周期

```bash
# 创建并启动容器
docker run [OPTIONS] <image_name>
docker run -d --name mycontainer -p 8080:80 nginx

# 常用选项说明
-d, --detach          # 后台运行
--name string         # 指定容器名称
-p, --publish list    # 端口映射（宿主机端口:容器端口）
-v, --volume list     # 卷挂载
--network string      # 指定网络
-e, --env list        # 设置环境变量
--restart string      # 重启策略（no, on-failure, unless-stopped, always）
-it                   # 交互模式

# 启动/停止/重启容器
docker start <container_name/id>
docker stop <container_name/id>
docker restart <container_name/id>

# 暂停/恢复容器
docker pause <container_name/id>
docker unpause <container_name/id>
```

### 容器监控与操作

```bash
# 查看容器
docker ps          # 运行中的容器
docker ps -a       # 所有容器
docker ps -q       # 只显示容器ID
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 查看容器详情
docker inspect <container_name/id>

# 查看容器日志
docker logs <container_name/id>
docker logs -f <container_name/id>      # 实时日志
docker logs --tail 100 <container_name/id>  # 查看最后100行
docker logs -t <container_name/id>      # 显示时间戳

# 容器内执行命令
docker exec [OPTIONS] <container_name/id> <command>
docker exec -it mycontainer bash
docker exec mycontainer ls -la

# 删除容器
docker rm <container_name/id>
docker rm -f <container_name/id>        # 强制删除运行中的容器
docker container prune                  # 删除所有停止的容器
```

