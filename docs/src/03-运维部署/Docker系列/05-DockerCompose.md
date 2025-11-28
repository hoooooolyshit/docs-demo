

# Docker Compose

## 安装与配置

```bash
# 安装 Docker Compose Plugin
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 或使用包管理器安装
yum install docker-compose-plugin -y
apt-get install docker-compose-plugin -y
```

## docker-compose.yml 示例

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    container_name: web-server
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - frontend
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    env_file:
      - .env
    depends_on:
      - app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  app:
    build: 
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: latest
    container_name: application
    ports:
      - "8080:8080"
    networks:
      - frontend
      - backend
    environment:
      - DATABASE_URL=postgresql://db:5432/mydb
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.50'
          memory: 512M

  db:
    image: postgres:13
    container_name: database
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend
    restart: always

volumes:
  db_data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

## Docker Compose 命令

```bash
# 基础命令
docker compose up -d          # 启动服务
docker compose down           # 停止并移除
docker compose ps             # 查看服务状态
docker compose logs [service] # 查看日志
docker compose logs -f [service] # 实时日志

# 管理命令
docker compose start          # 启动服务
docker compose stop           # 停止服务
docker compose restart        # 重启服务
docker compose pause          # 暂停服务
docker compose unpause        # 恢复服务

# 运维命令
docker compose exec <service> <command>  # 在服务中执行命令
docker compose top             # 查看进程
docker compose config          # 验证和查看配置
docker compose images          # 列出使用的镜像
docker compose port <service> <port> # 查看端口绑定

# 扩展命令
docker compose up --scale <service>=<num>  # 扩展服务实例
docker compose build           # 构建或重新构建服务
docker compose pull            # 拉取服务镜像
```

