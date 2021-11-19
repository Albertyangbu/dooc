## centos使用socat进行流量转发 <!-- {docsify-ignore} -->

如所需转发的端口数量较少，则推荐使用此方法。

首先安装`socat`

```bash
sudo yum install socat -y
```

配置进行 TCP 转发，编辑服务文件，可根据需要自行调整此文件名，此处以 `socat-tcp` 为文件名作例：

```bash
sudo vim /etc/systemd/system/socat-tcp.service
```

添加以下内容，注意替换其中的 `本机端口号`、`目标地址`、`目标端口号`，其中，`目标地址` 可以是 IP 地址，也可以是域名地址：

```bash
[Unit]
Description=Socat TCP Forwarding Service
After=network.target

[Service]
Type=simple
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
DynamicUser=true
ExecStart=/usr/bin/socat TCP4-LISTEN:本机端口号,reuseaddr,fork TCP4:目标地址:目标端口号
Restart=always

[Install]
WantedBy=multi-user.target
```

接着，启动 socat 的 TCP 转发服务：

```bash
sudo systemctl enable socat-tcp
sudo systemctl start socat-tcp
```



如果还需要进行 UDP 转发，则继续编辑一个新文件，可根据需要自行调整此文件名，此处以 `socat-udp` 为文件名作例：

```bash
sudo vim /etc/systemd/system/socat-udp.service
```

添加以下内容，注意替换其中的 `本机端口号`、`目标地址`、`目标端口号`，其中，`目标地址` 可以是 IP 地址，也可以是域名地址：

```bash
[Unit]
Description=Socat UDP Forwarding Service
After=network.target

[Service]
Type=simple
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
DynamicUser=true
ExecStart=/usr/bin/socat -T 60 UDP4-LISTEN:本机端口号,reuseaddr,fork UDP4:目标地址:目标端口号
Restart=always

[Install]
WantedBy=multi-user.target
```

接着，启动 socat 的 UDP 转发服务：

```bash
sudo systemctl enable socat-udp
sudo systemctl start socat-udp
```

注意：本机防火墙放行此端口

