# Docker存储与网络

## 存储管理

### 数据卷操作

```bash
# 卷管理
docker volume create <volume_name>
docker volume ls
docker volume inspect <volume_name>
docker volume rm <volume_name>
docker volume prune                    # 删除未使用的卷

# 挂载示例
docker run -v /host/path:/container/path <image>      # 绑定挂载
docker run -v volume_name:/container/path <image>     # 命名卷挂载
docker run --mount type=bind,source=/host/path,target=/container/path <image>
```

### 数据管理最佳实践

```bash
# 创建数据卷容器
docker create -v /data --name datacontainer <base_image>

# 从数据卷容器挂载
docker run --volumes-from datacontainer <image>

# 备份数据卷
docker run --rm --volumes-from datacontainer -v $(pwd):/backup <image> \
  tar cvf /backup/backup.tar /data
```

## 网络管理

### 网络操作命令

```bash
# 网络管理
docker network ls
docker network create <network_name>
docker network create --driver bridge <network_name>
docker network inspect <network_name>
docker network rm <network_name>
docker network prune

# 容器网络操作
docker network connect <network_name> <container_name>
docker network disconnect <network_name> <container_name>

# 查看容器网络信息
docker port <container_name>
docker network inspect <network_name>
```

### 网络类型说明

```bash
# 创建不同网络类型
docker network create --driver bridge my-bridge
docker network create --driver overlay my-overlay
docker network create --driver macvlan --subnet=192.168.1.0/24 my-macvlan
```



