### Centos7部署docker和docker-compose

更新yum
```
yum update
```

卸载旧版本 ， 不确定自己装没装，就执行一下。

```bash
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

安装配置时的依赖包
```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置yum源
```
sudo yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

安装最新版本docker
```
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

查看安装结果
```
docker --version
```

启动并添加开启自动启动
```
sudo systemctl start docker
sudo systemctl enable docker
```


添加epel源
```
yum install -y epel-release
```

安装docker-compose
```
yum install -y docker-compose
```

查看结果
```
docker-compose --version
```
