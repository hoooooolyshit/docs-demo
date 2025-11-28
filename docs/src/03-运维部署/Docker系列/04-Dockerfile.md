# Dockerfile 详解

## 完整 Dockerfile 示例

```dockerfile
# 多阶段构建示例
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:17-jdk-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 设置环境变量
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV APP_HOME=/app
ENV USER=appuser

# 创建非root用户
RUN groupadd -r $USER && useradd -r -g $USER $USER

# 设置工作目录
WORKDIR $APP_HOME

# 复制应用文件
COPY --from=builder /app/target/*.jar app.jar
COPY --chown=$USER:$USER entrypoint.sh .

# 设置文件权限
RUN chmod +x entrypoint.sh

# 切换用户
USER $USER

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# 暴露端口
EXPOSE 8080

# 入口点
ENTRYPOINT ["./entrypoint.sh"]
```

## Dockerfile 指令详解

| 指令        | 说明         | 示例                                            |
| ----------- | ------------ | ----------------------------------------------- |
| FROM        | 指定基础镜像 | `FROM ubuntu:20.04`                             |
| LABEL       | 添加元数据   | `LABEL version="1.0"`                           |
| RUN         | 执行命令     | `RUN apt-get update && apt-get install -y curl` |
| COPY        | 复制文件     | `COPY ./app /app`                               |
| ADD         | 复制并解压   | `ADD app.tar.gz /app`                           |
| CMD         | 容器启动命令 | `CMD ["java", "-jar", "app.jar"]`               |
| ENTRYPOINT  | 入口点       | `ENTRYPOINT ["/app/start.sh"]`                  |
| ENV         | 环境变量     | `ENV JAVA_HOME=/usr/lib/jvm`                    |
| ARG         | 构建参数     | `ARG VERSION=latest`                            |
| EXPOSE      | 暴露端口     | `EXPOSE 8080`                                   |
| WORKDIR     | 工作目录     | `WORKDIR /app`                                  |
| USER        | 指定用户     | `USER nobody`                                   |
| VOLUME      | 挂载点       | `VOLUME /data`                                  |
| HEALTHCHECK | 健康检查     | 如上示例                                        |

