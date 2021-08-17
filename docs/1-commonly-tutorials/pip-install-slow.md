### pip install 速度慢

在 /home/[username]目录下输入如下命令，创建相关配置文件：

```bash
$ mkdir .pip　　　　#注意不是.pip3　　
$ cd .pip
$ vim pip.conf
```

使用阿里源，pip.conf内容如下，黏贴保存即可

```vim
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = mirrors.aliyun.com
```

