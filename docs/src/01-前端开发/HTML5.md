# 1 HTML 简介

## 1. 网页

我们接下来是进行的网页开发, 这里首先介绍下网页的相关概念：

1. 什么是网页？
2. 什么是HTML？
3. 网页的形成？

### 1.1 什么是网页

==网站==是指在因特网上根据一定的规则，使用 HTML 等制作的用于展示特定内容相关的网页集合。

==网页==是网站中的一“页”，通常是 ==HTML 格式的文件==，它要通过浏览器来阅读。

==网页是构成网站的基本元素==，它通常由图片、链接、文字、声音、视频等==元素==组成。通常我们看到的网页， 常见以 ==.htm== 或 ==.html== 后缀结尾的文件，因此将其俗称为 ==HTML 文件==。

### 1.2 什么是 HTML

==HTML== 指的是==超文本标记语言 (Hyper Text Markup Language)== ，它是用来描述网页的一种语言。

HTML 不是一种编程语言，而是一种标记语言 (markup language)。

标记语言是一套标记标签 (markup tag)。

==**所谓超文本，有 2 层含义：**==

1. 它可以加入图片、声音、动画、多媒体等内容（超越了文本限制 ）。
2. 它还可以从一个文件跳转到另一个文件，与世界各地主机的文件连接（超级链接文本 ）。

### 1.3 网页的形成

网页是由网页元素组成的，这些元素是利用 html 标签描述出来，然后通过浏览器解析来显示给用户的。

前端人员开发代码 ----> 浏览器显示代码（解析、渲染） -----> 生成最后的 Web 页面

### 1.4 网页总结

网页是图片、链接、文字、声音、视频等元素组成, 其实就是一个html文件(后缀名为html)

网页生成制作: 有前端人员书写 HTML 文件, 然后浏览器打开，就能看到了网页.

HTML: 超文本标记语言, 用来制作网页的一门语言. 有标签组成的. 比如 图片标签 链接标签 视频标签等…

## 2. 常用浏览器

浏览器是网页显示、运行的平台。常用的浏览器有 IE、火狐（Firefox）、谷歌（Chrome）、Safari和Opera等。 平时称为五大浏览器。

查看浏览器市场份额：http://tongji.baidu.com/data/browser

**浏览器内核**

浏览器内核（渲染引擎）： 负责读取网页内容，整理讯息，计算网页的显示方式并显示页面。

目前国内一般浏览器都会采用 Webkit/Blink 内核，如 360 、UC、QQ、搜狗等。

## 3. Web 标准（重点）

==Web 标准==是由 W3C 组织和其他标准化组织制定的==一系列标准的集合==。W3C（万维网联盟）是国际最著名的标准化组织。接下来围绕web标准,我们学习以下两点:

1. 为什么需要web标准
2. Web标准的构成

### 3.1 为什么需要 Web 标准

浏览器不同，它们显示页面或者排版就有些许差异。

遵循 Web 标准除了可以让不同的开发人员写出的页面更标准、更统一外，还有以下优点：

1. 让 Web 的发展前景更广阔。
2. 内容能被更广泛的设备访问。
3. 更容易被搜寻引擎搜索。
4. 降低网站流量费用。
5. 使网站更易于维护。
6. 提高页面浏览速度。

### 3.2 Web 标准的构成

主要包括==结构（Structure）== 、==表现（Presentation）==和行为==（Behavior）==三个方面。

Web 标准提出的最佳体验方案：==结构、样式、行为相分离==。

简单理解： ==结构写到 HTML 文件中， 表现写到 CSS 文件中， 行为写到 JavaScript 文件中==。

![image-20211002231354246](C:\Users\72819\AppData\Roaming\Typora\typora-user-images\image-20211002231354246.png



# 背景固定



# 外边距合并问题：

1.  为父元素定义边框
2.  为父元素定义内边距
3.  为父元素添加overflow: hidden;



# 浮动

清除浮动（本质是清除浮动造成的影响，如高度坍塌）：四种方式

隔墙法，在父元素前或后添加样式带有clear: both;的块级元素

```css
/* 方法一 */
.clearfix:after {
	content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
/* 方法二 */
.clearfix:before,.clearfix:after {
    content: "";
    display: table;
}
.clearfix:after {
    clear: both;
}
```



# CSS属性书写顺序

建议遵循以下顺序

1.  布局定位属性：display、position、float、clear、visibility、overflow（建议display第一个写，毕竟关系到模式）
2.  自身属性：width、height、margin、padding、border、background
3.  文本属性：color、font、text-decoration、text-align、vertical-align、white-space、break-word
4.  其他属性：content、cursor、border-radius、box-shadow、text-shadow、background: linear-gradient……



# 定位

-   静态定位
-   相对定位
-   绝对定位
-   粘性定位

子绝父相



# CSS利用边框做三角



# 改变鼠标样式

| 属性值      | 描述      |
| ----------- | --------- |
| default     | 小白 默认 |
| pointer     | 小手      |
| move        | 移动      |
| text        | 文本      |
| not-allowed | 禁止      |



# 图片和文字的对齐方式 

vertical-align: ;

行内元素和行内块元素都可以设置这个样式与文字对齐

图片底部默认空白缝隙问题：

1.  因为图片默认基线对齐，改成其他对齐方式就可以解决
2.  或者将图片转换成块级元素，因为块级元素没有vertical-align这个样式



# 溢出的文字用省略号显示

```css
/* 单行文本溢出显示省略号 */
.ellipse {
    /* 1、强制一行内显示文本（默认normal自动换行） */
    white-space: nowrap;
    /* 2、超出的部分隐藏 */
    overflow: hidden;
    /* 3、文字用省略号替代超出的部分 */
    text-overflow: ellipsis;
}
/* 多行文本溢出显示省略号 */
.ellipse-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    /* 弹性伸缩盒子模型显示 */
    display: -webkit-box;
    /* 限制在一个块元素显示的文本的行数 */
    -webkit-line-clamp: 2;
    /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-box-orient: vertical;
}
```



# HTML5新增标签

## 语义化标签

-   header：头部标签
-   nav：导航标签
-   article：内容标签
-   section：定义文档某个区域
-   aside：侧边栏标签
-   footer：尾部标签

## 多媒体标签

-   audio：音频标签
-   video：视频标签

## input输入框类型





## 表单属性