## mac安装zsh并配置插件

> zsh配置太复杂，安装on-my-zsh



### 安装

国际镜像

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

国内镜像

```bash
sh -c "$(curl -fsSL https://gitee.com/shmhlsy/oh-my-zsh-install.sh/raw/master/install.sh)"
```



#### 安装 Oh My Zsh PowerLevel10K 主题

```bash
git clone https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
```

用编辑器打开“~/.zshrc”文件，然后修改“ZSH_THEME”的值：

```shell
ZSH_THEME="powerlevel10k/powerlevel10k"
```

使之生效

```bash
source ~/.zshrc
```



#### 安装常用插件

- zsh-syntax-highlighting 语法高亮插件

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

- zsh-autosuggestions 自动路径补全插件

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```



用编辑器打开“~/.zshrc”文件，在文件里找到plugins=(git)，括号是插件列表，git是默认安装的插件。添加插件

```shell
plugins=(
  git
  zsh-syntax-highlighting
  zsh-autosuggestions
)
```

使之生效

```bash
source ~/.zshrc
```

