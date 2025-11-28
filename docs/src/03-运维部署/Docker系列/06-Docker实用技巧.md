# 实用技巧和最佳实践

## 资源限制

```bash
# 运行容器时设置资源限制
docker run -d \
  --name myapp \
  --memory=512m \
  --cpus=1.0 \
  --cpu-shares=1024 \
  --memory-reservation=256m \
  nginx:alpine
```

## 日志管理

```bash
# 配置日志驱动和选项
docker run -d \
  --name myapp \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx:alpine
```

## 清理操作

```bash
# 系统清理
docker system df              # 查看磁盘使用
docker system prune           # 清理所有未使用资源
docker system prune -a        # 彻底清理
docker system prune --volumes # 包括卷

# 选择性清理
docker container prune        # 清理停止的容器
docker image prune            # 清理无用镜像
docker volume prune           # 清理无用卷
docker network prune          # 清理无用网络
```

## 监控和调试

```bash
# 容器监控
docker stats                  # 实时资源监控
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
docker top <container>        # 查看容器进程

# 调试工具
docker events                 # 查看Docker事件
docker diff <container>       # 查看容器文件变化
```

## 安全最佳实践

```bash
# 使用非root用户运行
docker run --user 1000:1000 <image>

# 设置只读文件系统
docker run --read-only -v /tmp <image>

# 安全选项
docker run --security-opt=no-new-privileges <image>
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE <image>
```
