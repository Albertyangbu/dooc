### Linux时间矫正和时区调整

#### 时间矫正

使用`ntpdate`命令

```bash
ntpdate 1.cn.pool.ntp.org
```

若无，则通过`yum`安装

```bash
yum -y install ntp
```

#### 时区设置

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
echo "Asia/Shanghai" >/etc/timezone
```
