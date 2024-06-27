### docker安装mysql8

添加docker network，方便后续使用

```
docker network create --driver bridge --subnet=177.11.1.0/24 --gateway=177.11.1.1 mysql
```

拉取镜像

```
docker pull mysql:8.0.31
```

启动容器

```
docker run \
-d \
--network mysql \
--name mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-p 3306:3306 \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-v /usr/local/docker/mysql-files/log:/var/lib/mysql-files \
-v /usr/local/docker/mysql/log:/var/log/mysql \
mysql:8.0.31
```

添加跟随docker自动启动

```
docker update --restart=always mysql
```
