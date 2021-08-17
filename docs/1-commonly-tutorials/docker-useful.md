### docker常用命令

docker 打包到本地
```bash
docker build -f docker-prod/Dockerfile -t demo-gateway:1.0 .
```

docker 镜像下载
```bash
docker save demo-gateway:1.0 > /Users/yangbo/Downloads/docker-images/demo-gateway-1.0.tar
```

docker 删除tag未none的镜像
```bash
docker images|grep none|awk '{print $3}'|xargs docker rmi
```