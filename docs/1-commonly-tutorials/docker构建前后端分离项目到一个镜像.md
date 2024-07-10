### docker构建前后端分离项目到一个镜像

- 前端 vue3
- 后端 springboot

编译部署项目

- 前端编译打包生成`dist`
- 后端编译打包生成`xxx-app.jar`

新建工作目录，并将上面编译的文件放入工作目录

```shell
mkdir docker-tmp
cd docker-tmp
```

编辑nginx配置，放在工作目录

> 仅供参考，nginx配置不是此文的重点，如有疑问请自己解决

```shell
user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       10081;
        server_name  localhost;

        # 若项目使用gzip则可增加下面这些配置
        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 9;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
        gzip_vary on;
        gzip_disable "MSIE [1-6]\.";

        location / {
            root   /usr/share/nginx/html;
            try_files $uri $uri/ @router;
            index  index.html index.htm;
            error_page 405 =200 http://$host$request_uri;
        }
        location @router {
            rewrite ^.*$ /index.html last;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}

```

编辑Dockerfile，放在工作目录

> 我这里使用的基础镜像jdk版本是17，可去docker hub自行选择适合自己的jdk版本替换

```dockerfile
FROM openjdk:17-jdk-alpine
MAINTAINER ydct
VOLUME /tmp

# 设置时区
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

# 安装nginx
RUN apk add nginx

# 前端
COPY ./dist/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf

# 后端
COPY ./xxx-app.jar /app.jar

ENV JAVA_OPTS="-server -Xms128m -Xmx512m"
ENV JAVA_PROJECT_PARAMS="--spring.profiles.active=local"
EXPOSE 10081 10082

# 运行后端
ENTRYPOINT nginx && java ${JAVA_OPTS} -jar /app.jar ${JAVA_PROJECT_PARAMS}
```

此时工作目录共有4个文件或目录：`dist`、`xxx-app.jar`、`nginx.conf`、`Dockerfile`


构建镜像

```shell
docker build --platform linux/amd64 -f ./Dockerfile -t springboot_vue:v1 .
```

运行容器

```shell
docker run -itd --name springboot_vue -e JAVA_PROJECT_PARAMS="--spring.profiles.active=prod" -p 10081:10081 -p 10082:10082 springboot_vue:v1
```