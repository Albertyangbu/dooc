### docker安装blossom

[官网教程](https://www.wangyunf.com/blossom-doc/guide/deploy/backend-docker.html)

若没有安装docker或mysql，可参考:

* [Centos7部署docker和docker-compose](/1-commonly-tutorials/Centos7部署docker和docker-compose)
* [docker安装mysql8](/1-commonly-tutorials/docker安装mysql8)

拉取镜像

```
docker pull jasminexzzz/blossom:latest
```

启动容器，并加入mysql网络

```
docker run -d \
  --network mysql \
  --name blossom-backend \
  -p 9999:9999 \
  -v /home/blossom/bl/:/home/bl/ \
  jasminexzzz/blossom:1.16.0 \
  --spring.datasource.url="jdbc:mysql://mysql:3306/blossom?useUnicode=true&characterEncoding=utf-8&allowPublicKeyRetrieval=true&allowMultiQueries=true&useSSL=false&&serverTimezone=GMT%2B8" \
  --spring.datasource.username=blossom \
  --spring.datasource.password=blossom
```
