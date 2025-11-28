## Git

### 概述（介绍、下载和安装）

### 代码托管

### 常用命令

#### Git 全局设置

-   设置用户信息（虚拟）
    -   `git config --global user.name "hoooooolyshit"`
    -   `git config --global user.email "holyshit@qq.com"`
-   查看配置信息
    -   `git config --list`

#### Git 仓库

**获取 Git 仓库**

1.  在本地初始化一个 Git 仓库（不常用）
    1.  创建一个空目录作为本地仓库
    2.  执行命令 `git init` 初始化仓库
2.  从远程仓库克隆（常用）
    1.  执行命令`git clone [远程仓库地址]`
    2.  会自动生成一个目录，该目录就是远程克隆过来的仓库

**工作区、暂存区、版本库概念**

-   版本库：.git 隐藏文件就是版本库，存储配置信息、日志信息和文件版本信息等
-   工作区：包含 .git 文件的目录就是工作区，主要用于存放开放的代码
-   暂存区：工作目录下有一个 index 文件就是暂存区（stage），临时保存修改文件的地方

**Git 工作区中文件的状态**

-   untracked 未跟踪（未被纳入版本控制）
-   tracked 已跟踪（被纳入版本控制）
    1.  Unmodified 未修改状态
    2.  Modified 已修改状态
    3.  Staged 已暂存状态

#### 	本地仓库操作

-   `git add`将指定文件将文件的修改加入暂存区（切换到已跟踪状态）
-   `git status`查看文件的状态
-   `git reset`将暂存区的文件取消暂存（切换到未跟踪状态）或是切换到指定版本
-   `git commit`将暂存区的文件修改提交到版本库
-   `git log`查看日志

#### 远程仓库操作

-   `git remote`查看关联的远程仓库
-   `git remote add`添加（关联）远程仓库
-   `git clone`从远程仓库克隆
-   `git pull`从远程仓库拉取最新版本合并到本地仓库
-   `git push`推送到远程仓库

#### 分支操作

-   `git branch`查看分支
-   `git branch [name]`创建分支
-   `git checkout [name]`切换分支
-   `git push [远程仓库别名] [name]`推送至远程仓库分支
-   `git merge [name]`合并分支到主分支

#### 标签操作

Git 中的标签，指的是某个分支在某个特定时间点的状态。通过标签，可以很方便的切换到标记时的状态

-   `git tag`列出已有的标签
-   `git tag [name]`创建标签
-   `git push [远程仓库别名] [name]`将标签推送至远程仓库
-   `git checkout -b [branch] [name]`检出标签到新的分支

### IDEA 中使用 Git
