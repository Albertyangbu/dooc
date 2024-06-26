### Docker自建镜像完成Jmeter分布式压测

单机压测线程数有限，若需要进行大量压测，则需要使用分布式压测。本次教程，master使用mac主机，slave使用docker容器。

#### 自制镜像

> docker环境请自行准备

从官网下载Jmeter5.5 [点击下载](https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.5.zip)

创建一个文件夹作为工作目录，并将下载后的压缩包放到该目录

```shell
mkdir jmeter-docker-tmp
cd jmeter-docker-tmp
```

打开压缩包，修改`/bin/jmeter.properties`中如下配置

```properties
# master地址
remote_hosts=ip:port(比如 192.168.10.123:1099)

# 关闭ssl
server.rmi.ssl.disable=true
```

重新压缩，压缩包名称为`apache-jmeter-5.5.zip`

编辑`Dockerfile`文件，内容如下

```dockerfile
FROM openjdk:8u121-jdk-alpine
MAINTAINER TesterHome

ARG JMETER_VERSION=5.5

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# Install JMeter
RUN mkdir /jmeter
ADD apache-jmeter-$JMETER_VERSION.zip /jmeter/apache-jmeter-$JMETER_VERSION.zip
RUN cd /jmeter \
    && unzip apache-jmeter-$JMETER_VERSION.zip

# Set ENV
ENV JMETER_HOME /jmeter/apache-jmeter-$JMETER_VERSION/
ENV PATH $JMETER_HOME/bin:$PATH
ENV REMOTE_PORT=10991
ENV REMOTE_IP=127.0.0.1

# Ports to be exposed from the container for JMeter Slaves/Server
EXPOSE ${REMOTE_PORT}

# Application to run on starting the container
ENTRYPOINT $JMETER_HOME/bin/jmeter-server \
                        -Dserver.rmi.localport=${REMOTE_PORT} \
                        -Dserver_port=${REMOTE_PORT} \
                        -Djava.rmi.server.hostname=${REMOTE_IP}

```

此时工作目录中应该存在如下2个文件
```shell
> ls
Dockerfile apache-jmeter-5.5.zip
```

使用dockerfile构建镜像

```shell
build -f ./Dockerfile -t jmeterbase:v1 .
```

#### 启动容器

> 因为我是在本机运行，所以使用不同的端口，若容器在其他主机运行，请使用目标主机的ip，端口根据实际情况定义

```shell
docker run -itd --name js1 -e REMOTE_PORT=10991 -e REMOTE_IP=127.0.0.1 -p 10991:10991 jmeterbase:v1
docker run -itd --name js2 -e REMOTE_PORT=10992 -e REMOTE_IP=127.0.0.1 -p 10992:10992 jmeterbase:v1
```

查看容器日志

```shell
docker logs js1 --tail 10
```

打印如下内容表示成功

```text
Jun 25, 2024 9:12:53 AM java.util.prefs.FileSystemPreferences$1 run
INFO: Created user preferences directory.
Using local port: 10991
Created remote object: UnicastServerRef2 [liveRef: [endpoint:[127.0.0.1:10991](local),objID:[xxxx]]]
```

#### 主机配置

> 建议主机使用的Jmeter和slave版本一致

打开主机使用的Jmeter，在`/bin/jmeter.properties`中修改如下配置

```properties
# 修改为slave地址，请注意，此次地址必须和slave容器中打印的endpoint一致，且需要主机能访问到该地址
remote_hosts=127.0.0.1:10991,127.0.0.2:10992

# 服务端口，影响上面slave中remote_hosts的端口
server_port=1099

# 关闭ssl
server.rmi.ssl.disable=true
```

#### 远程执行脚本

> Jmeter脚本请自行准备

点击Jmeter Gui菜单栏，运行->远程启动/远程启动所有

在slave容器中可看到如下日志

```text
Starting the test on host 127.0.0.1:10991 @ June 26, 2024 9:16:54 AM CST (xxxx)
Finished the test on host 127.0.0.1:10991 @ June 26, 2024 9:17:55 AM CST (xxxx)
```