# centos7安装卸载切换图形化界面 <!-- {docsify-ignore} -->

升级yum

```bash
sudo yum -y upgrade
```

安装具有 yum 组安装的 GNOME 桌面软件包组

```bash
yum groupinstall "GNOME Desktop"
```

使用 startx 手动启动桌面环境

```bash
startx
```

如果安装了多个环境, 则需要指定 gnome-sesp 的路径

```bash
startx /usr/bin/gnome-session
```

默认目标决定系统是引导到基于 gui 的登录屏幕

```bash
systemctl set-default graphical.target
```

默认目标设置回多用户, 系统将再次启动到基于终端的登录屏幕

```bash
systemctl set-default multi-user.target
```
