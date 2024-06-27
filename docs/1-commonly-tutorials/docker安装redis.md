### docker安装redis

拉取镜像

```
docker pull redis:7.0
```

创建挂载目录

```
mkdir -p /usr/local/docker/redis/conf
mkdir -p /usr/local/docker/redis/data
```

从源码获取配置文件，并放入`/usr/local/docker/redis/conf`

[配置文件示例](/1-commonly-tutorials/redis-example)

在配置文件中找到`requirepass`设置密码

启动容器

```
docker run \
  --name redis \
  -p 6379:6379 \
  -v /usr/local/docker/redis/conf:/usr/local/etc/redis \
  -v /usr/local/docker/redis/data:/data \
  -d redis:7.0 redis-server /usr/local/etc/redis/redis.conf
```

使用`redis-cli`测试

```
docker exec -it redis redis-cli
```

设置自启动

```
docker update --restart=always redis
```
