### 下载VMware

[VMware官网](https://www.vmware.com/)

### 下载CentOS7镜像

[centos-7-isos-x86_64安装包下载_开源镜像站-阿里云 (aliyun.com)](https://mirrors.aliyun.com/centos/7/isos/x86_64/)

### 创建虚拟机

1、首先，启动 VMware Workstation，点击“文件”菜单中的“新建虚拟机”，选择“自定义（高级）”选项，然后点击“下一步”继续；

![image-20251109192635400](.\VMware虚拟机.assets\image-20251109192635400.png)

2、**虚拟机硬件兼容性**保持默认，直接点击“下一步”继续；

3、**安装来源**选择“稍后安装操作系统”，然后点击“下一步”继续；

![image-20251109193307032](.\VMware虚拟机.assets\image-20251109193307032.png)

4、**客户机操作系统**选择“Linux”，版本选择“CentOS 7 64位”，然后点击“下一步”继续；

![image-20251109193458173](.\VMware虚拟机.assets\image-20251109193458173.png)

5、**命名虚拟机**输入自定义的“虚拟机名称”，并制定虚拟机的存储位置，然后点击“下一步”继续；

![image-20251109193928164](.\VMware虚拟机.assets\image-20251109193928164.png)

6、**处理器配置**设置“处理器数量”和“每个处理器的内核数量”，然后点击“下一步”继续；

![image-20251109194236501](.\VMware虚拟机.assets\image-20251109194236501.png)

7、**此虚拟机的内存**设置虚拟机的内存大小，然后点击“下一步”继续；

![image-20251109194352470](.\VMware虚拟机.assets\image-20251109194352470.png)

8、**网络类型**根据实际需要选择适合的网络模式，安装向导中已对各种模式进行了详细说明，补充说明如下：

- 使用桥接网络：虚拟机的IP与主机在同一网段，主机和虚拟机可以通过IP互通，主机联网时虚拟机也可联网，并且虚拟机与同网段的其他主机可以互通，常用于服务器环境。
- 使用网络地址转换（NAT）：虚拟机可以联网，与主机互通，但与主机网段内的其他主机不通。
- 使用仅主机模式网络：虚拟机无法联网，与主机互通，但与主机网段内的其他主机不通。

然后点击“下一步”继续；

![image-20251109194642168](.\VMware虚拟机.assets\image-20251109194642168.png)

9、**选择I/O控制器类型**保持默认，直接点击“下一步”继续；

10、**选择磁盘类型**保持默认，直接点击“下一步”继续；

11、**选择磁盘**保持默认，直接点击“下一步”继续；

12、**指定磁盘容量**设置虚拟机磁盘大小，默认20G可能不够用，建议设置更大一些，然后点击“下一步”继续；

![image-20251109194943404](.\VMware虚拟机.assets\image-20251109194943404.png)

13、**指定磁盘文件**保持默认，直接点击“下一步”继续；

14、**已准备好创建虚拟机**保持默认，直接点击“完成”结束虚拟机的创建；

15、退出安装向导后，在虚拟机管理界面的左侧栏可以看到新创建的虚拟机，右侧栏显示了虚拟机的详细配置信息，点击“编辑虚拟机设置”选项继续；

![image-20251109201236245](.\VMware虚拟机.assets\image-20251109201236245.png)

16、在**虚拟机设置**界面指定“CD/DVD(IDE)”安装镜像，并移除“USB控制器”、“声卡”和“打印机”，然后点击“确定”；

![image-20251109201449785](.\VMware虚拟机.assets\image-20251109201449785.png)

17、至此虚拟机创建完成，接下来启动虚拟机进入CentOS操作系统的安装过程。

### 安装CentOS7系统

1、启动虚拟机进入CentOS操作系统，选择“Install CentOS Linux 7”，然后根据提示按回车键继续；

![image-20251109202154169](.\VMware虚拟机.assets\image-20251109202154169.png)

2、在下面的界面中，默认选择“English”，然后点击“Continue”继续；

![image-20251109202425360](.\VMware虚拟机.assets\image-20251109202425360.png)

3、CentOS7安装配置的主要包含localization、software、system3个部分，localization和software部分不需要进行任何设置，值得注意的是software selection选项，这里采用默认值**Minimal install**（即最小化安装，这种安装的Linux系统不包含图形界面），其他组件可以在后期通过yum安装。

![image-20251109202546562](.\VMware虚拟机.assets\image-20251109202546562.png)

4、system部分需要配置的是红色部分选项，即磁盘分区规划，点进去继续；

![image-20251109202847941](.\VMware虚拟机.assets\image-20251109202847941.png)

5、选中硬盘，滚动条到底部，选择“我将配置分区”，即自定义磁盘分区，最后点击左上角的“done”进行磁盘分区规划；

![image-20251109203239768](.\VMware虚拟机.assets\image-20251109203239768.png)

6、在下图界面进行CentOS7的磁盘分区，这里先说明一下前期规划：

/boot：1024M，使用标准分区格式创建。

swap：4096M，使用标准分区格式创建。

/：使用剩余所有空间，采用LVM卷组格式创建。

规划后的界面如下，点击“done”完成分区规划，在弹出对话框中点击“accept changes”；

![image-20251109203719953](.\VMware虚拟机.assets\image-20251109203719953.png)

7、点击下图蓝色部分，修改操作系统主机名，并打开以太网，然后点击“Done”继续；

![image-20251109204314345](.\VMware虚拟机.assets\image-20251109204314345.png)

![image-20251109204423751](.\VMware虚拟机.assets\image-20251109204423751.png)

8、从第7步配置开始，我们可以发现右下角的“begin installation”按钮已经从灰色变为蓝色，这表示已经可以进行操作系统的安装工作，点击“begin installation”开始安装操作系统；

9、在下图的用户设置中，只需修改root用户密码，点击“root password”设置密码，可能需要点击两次确定才可以；

![image-20251109204832445](.\VMware虚拟机.assets\image-20251109204832445.png)

10、当root密码设置成功后，返回安装界面时可以发现之前的user setting界面上的红色警告消失了，点击“finish configuration”后等待一会，然后点击“reboot”重启操作系统；

![image-20251109204853120](.\VMware虚拟机.assets\image-20251109204853120.png)

11、使用root用户登录，输入`ping www.baidu.com`测试网络连通性；

![image-20251109205419641](.\VMware虚拟机.assets\image-20251109205419641.png)

至此，CentOS7操作系统安装成功。

### 远程连接虚拟机

1、虚拟机命令行终端输入`ip a`查看ens33这块网卡的IP地址；

![image-20251109211611274](.\VMware虚拟机.assets\image-20251109211611274.png)

2、FinalShell新建SSH连接，相关内容配置如图所示：

![image-20251109211525954](.\VMware虚拟机.assets\image-20251109211525954.png)

3、双击刚才创建好的连接；

![image-20251109211725780](.\VMware虚拟机.assets\image-20251109211725780.png)

显示连接成功，接下来我们就可以直接在这里面进行相关操作了

### 更换国内源

什么是国内源，通俗讲就是应用市场，Android系统有Android应用市场，Apple系统有Apple应用市场，Linux系统也有Linux应用市场。

Linux的国内源根据不同的版本分，主要有：

- CentOS版本：yum源
- Ubuntu版本：apt-get源

> 注1：如果只是简单配置下Linux及安装下JDK、Tomcat等工具，不需要更新国内源，国内源主要是解决访问国外服务器速度慢。
> 注2：yum只是命令，epel才是源。

CentOS换EPEL源，CentOS中EPEL源的目录为：/etc/yum.repos.d：
1、备份Linux自带的EPEL源

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
```

> 注：CentOS的yum源在/etc/yum.repos.d/CentOS-Base.repo，版本不同，源的文件名也不同。

2、使用阿里云镜像源

```bash
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
# 如果未找到wget命令就使用curl
# curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

3、清理并重建缓存

```bash
yum clean all
yum makecache
```

测试 yum 是否正常工作

```bash
yum update -y
```

