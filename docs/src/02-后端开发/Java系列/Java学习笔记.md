# 第二章	数据类型和运算符



## 2.1	注释

​		为了方便程序的阅读，Java语言允许程序员在程序中写上一些说明性的文字，用来提高程序的可读性，这些文字性的说明就称为注释。 注释不会出现在字节码文件中，即Java编译器编译时会跳过注释语句。 在Java中根据注释的功能不同，主要分为单行注释、多行注释和文档注释。

- 单行注释： 使用 "//" 开头，"//" 后面的单行内容均为注释。
- 多行注释：  以 "/\*" 开头以 "\*/" 结尾，在 "/\*" 和 "\*/" 之间的内容为注释，我们也可以使用多行注释作为行内注释。但是在使用时要注意，多行注释不能嵌套使用。
- 文档注释：  以 "/\*" 开头以 "\*/" 结尾，注释中包含一些说明性的文字及一些 JavaDoc 标签(后期写项目时，可以生成项目的 API )

【示例2-1】认识 Java 的三种注释类型

```java
/**
 * Welcome类（我是文档注释）
 * @author 高淇
 * @version 1.0
 */
public class Welcome {
    //我是单行注释
    public static void main(String[] args/*我是行内注释*/) {
        System.out.println("Hello World!");
    }
    /*
       我是多行注释！
       我是多行注释！
    */
}
```



## 2.2	标识符

​		标识符是用来给变量、类、方法以及包进行命名的，如Welcome、main、System、age、name、gender等。标识符需要遵守一定的规则：

- 标识符必须以字母、下划线 __ 、美元符号 $ 开头。  
- 标识符其它部分可以是字母、下划线 "__" 、美元符 "$" 和数字的任意组合。
- Java 标识符大小写敏感，且长度无限制。
- 标识符不可以是 Java 的关键字。

**标识符的使用规范**

- 表示类名的标识符：每个单词的首字母大写，如 Man, GoodMan
- 表示方法和变量的标识符：第一个单词小写，从第二个单词开始首字母大写，我们称之为 “驼峰原则” ，如 eat(), eatFood()

**【注意】：**Java 不采用通常语言使用的 ASCII 字符集，而是采用 Unicode 这样标准的国际字符集。因此，这里字母的含义不仅仅是英文，还包括汉字等等。但是不建议大家使用汉字来定义标识符！

【示例2-2】合法的标识符

```java
int  a = 3;
int  _123 = 3;
int  $12aa = 3;
int  变量1 = 55;  //合法，但是不建议使用中文命名的标识符
```

【示例2-3】不合法的标识符

```java
int  1a = 3;   //不能用数字开头
int  a# = 3;   //不能包含 # 这样的特殊字符
int  int = 3;  //不能使用关键字
```

课堂测试代码：

```java
/**
 * 测试标识符的用法
 * @author 高淇
 *
 */
public class TestIdentifer {
     
    //能力是练出来的，不是看书看出来的。对于初学者来说，再简单的代码也一定要敲一下！
    public static void main(String[] args) {
        int  a123 = 1;
        //int  123abc = 2;        //数字不能开头
        int  $a = 3;
        int  _abc = 4;
        //int  #abc = 5;
         
        int  年龄 = 18;        //可以使用汉字，但是一般不建议
         
        //int class = 2;        //关键字不能作为标识符
         
    }
}
```



## 2.3	Java 中的关键字/保留字

​		Java 关键字是 Java 语言保留供内部使用的，如 class 用于定义类。 关键字也可以称为保留字，它们的意思是一样的，我们不能使用关键字作为变量名或方法名。

<div align = "center">表 2-1 Java 中的关键字/保留字</div>

| abstract   | assert  | boolean   | break     | byte       | case         |
| ---------- | ------- | --------- | --------- | ---------- | ------------ |
| catch      | char    | class     | const     | continue   | default      |
| do         | double  | else      | extends   | final      | finally      |
| float      | for     | goto      | if        | implements | import       |
| instanceof | int     | interface | long      | native     | new          |
| null       | package | private   | protected | public     | return       |
| short      | static  | strictfp  | super     | switch     | synchronized |
| this       | throw   | throws    | transient | try        | void         |
| volatile   | while   |           |           |            |              |

> **菜鸟雷区**
>
> 出于应试教育的惯性思维，很多新手很可能去背上面的单词，从实战思维出发，我们不需要刻意去记！随着学习的深入，自然就非常熟悉了。



## 2.4	变量

### 2.4.1	变量的本质

​		变量本质上就是代表一个 ”可操作的存储空间” ，空间位置是确定的，但是里面放置什么值不确定。我们可通过变量名来访问 “对应的存储空间” ，从而操纵这个 “存储空间” 存储的值。

​		Java 是一种强类型语言，每个变量都必须声明其数据类型。变量的数据类型决定了变量占据存储空间的大小。 比如，int a = 3; 表示 a 变量的空间大小为 4 个字节。

​		变量作为程序中最基本的存储单元，其要素包括变量名，变量类型和作用域。变量在使用前必须对其声明, 只有在变量声明以后，才能为其分配相应长度的存储空间。

**变量的声明**

格式为：

```java
type  varName [=value][,varName[=value]...]; 
//[]中的内容为可选项，即可有可无
数据类型  变量名  [=初始值] [,变量名  [=初始值]…];
```

**【示例2-4】 声明变量：**

```java
double  salary;
long  earthPopulation;
int  age;
```

不同数据类型的变量会在内存中分配不同的空间，如图 2-1 所示。

E:\target\java\2.4.1变量的本质.png

<div align = "center">图 2-1 声明变量的内存示意图</div>

**注意事项**

- 每个变量都有类型，类型可以是基本类型，也可以是引用类型。
- 变量名必须是合法的标识符
- 变量声明是一条完整的语句，因此每一个声明都必须以分号结束

**【示例2-5】在一行中声明多个变量**

```java
int  i, j; // 两个变量的数据类型都是int
```

> **老鸟建议**
>
> 不提倡这种 "一行声明多个变量" 风格，逐一声明每一个变量可以提高程序可读性。

**【示例2-6】可以将变量的声明和初始化放在同一行中**

```java
int  age = 18;    
double  e = 2.718281828;
```



### 2.4.2	变量的分类

​		从整体上可将变量划分为局部变量、成员变量(也称为实例变量)和静态变量。

<div align = "center">表 2-2 局部变量、成员变量、静态变量的区别</div>

| 类型               | 声明位置           | 从属于      | 生命周期                                                     |
| ------------------ | ------------------ | ----------- | ------------------------------------------------------------ |
| 局部变量           | 方法或语句块内部   | 方法/语句块 | 从声明位置开始，直到方法或语句块执行完毕，局部变量消失       |
| 成员变量(实例变量) | 类内部，方法外部   | 对象        | 对象创建，成员变量也跟着创建。对象消失，成员变量也跟着消失； |
| 静态变量(类变量)   | 类内部，static修饰 | 类          | 类被加载，静态变量就有效；类被卸载，静态变量消失。           |

> **老鸟建议**
>
> 成员变量和静态变量不是目前重点，不要过多纠结理解与否。我们学习面向对象时，再重点讲解成员变量和静态变量

- **局部变量(local  variable)**

​		方法或语句块内部定义的变量。生命周期是从声明位置开始到到方法或语句块执行完毕为止。局部变量在使用前必须先声明、初始化(赋初值)再使用。

**【示例2-7】局部变量**

```java
public void test() {
   int i;
   int j = i+5 ; // 编译出错，变量i还未被初始化 
} 
  
public void test() {
   int i;
   i=10;
   int j = i+5 ; // 编译正确
}
```

- **成员变量（也叫实例变量  member variable）**

​		方法外部、类的内部定义的变量。从属于对象，生命周期伴随对象始终。如果不自行初始化，它会自动初始化成该类型的默认初始值。

<div align = "center">表 2-3 实例变量的默认初始值</div>

| 数据类型 | 默认初始值 |
| -------- | ---------- |
| int      | 0          |
| double   | 0.0        |
| char     | ‘\u0000’   |
| boolean  | false      |

**【示例2-8】实例变量的声明**

```java
public class Test {
    int i;
}
```

- **静态变量（类变量 static variable）**

​		使用 static 定义。 从属于类，生命周期伴随类始终，从类加载到卸载。 (注：讲完内存分析后我们再深入！先放一放这个概念！)如果不自行初始化，与成员变量相同会自动初始化成该类型的默认初始值，如表 2-3所示。

**课堂练习1：变量的声明并赋值**

```java
public class LocalVariableTest {
  public static void main(String[ ] args) {
      boolean flag = true;  // 声明boolean型变量并赋值
       char c1, c2;   // 声明char型变量
       c1 = '\u0041';   // 为char型变量赋值
      c2 = 'B';   // 为char型变量赋值
      int x;   // 声明int型变量
      x = 9;  //为int型变量赋值  
       int y = x;  // 声明并初始化int型变量
       float f = 3.15f;   // 声明float型变量并赋值
      double d = 3.1415926;  //声明double型变量并赋值
         }
}
```

**课堂代码：**

```java
/**
 * 测试变量
 * 
 * @author 高淇
 *
 */
public class TestVariable {
 
    int a;            //成员变量, 从属于对象； 成员变量会自动被初始化
    static  int  size;   //静态变量，从属于类
     
    public static void main(String[] args) {
 
        {
            int age;        //局部变量，从属于语句块；
            age = 18;
        }
         
        int salary = 3000;    //局部变量，从属于方法
 
        int gao = 13;
        System.out.println(gao);
 
        int i;
    //    int j = i + 5; // 编译出错，变量i还未被初始化
         
    }
}
```



## 2.5	常量（constant）

​		常量通常指的是一个固定的值，例如：1、2、3、’a’、’b’、true、false、”helloWorld” 等。

​		在 Java 语言中，主要是利用关键字 final 来定义一个常量。 常量一旦被初始化后不能再更改其值。

**声明格式为：**

```java
final  type  varName = value;
```

**【示例2-9】常量的声明及使用**

```java
public class TestConstants {
    public static void main(String[] args) {
        final double PI = 3.14;
        // PI = 3.15; //编译错误，不能再被赋值！ 
        double r = 4;
        double area = PI * r * r;
        double circle = 2 * PI * r;
        System.out.println("area = " + area);
        System.out.println("circle = " + circle);
    }
}
```

​		为了更好的区分和表述，一般将1、2、3、’a’、’b’、true、false、”helloWorld” 等称为字面常量，而使用 final 修饰的 PI 等称为符号常量。

> **老鸟建议**
>
> ​	变量和常量命名规范（规范是程序员的基本准则，不规范会直接损害你的个人形象）：
>
> 1. 所有变量、方法、类名：见名知意
> 2. 类成员变量：首字母小写和驼峰原则:  monthSalary
> 3. 局部变量：首字母小写和驼峰原则
> 4. 常量：大写字母和下划线：MAX_VALUE
> 5. 类名：首字母大写和驼峰原则:  Man, GoodMan
> 6. 方法名：首字母小写和驼峰原则: run(), runRun()



## 2.6	基本数据类型(primitive data type)

​		Java 是一种强类型语言，每个变量都必须声明其数据类型。 Java 的数据类型可分为两大类：基本数据类型（primitive data type）和引用数据类型（reference data type）。

**Java中定义了3类8种基本数据类型**

- 数值型－ byte、 short、int、 long、float、 double
- 字符型－ char
- 布尔型－boolean 

E:\target\java\2.6基本数据类型.png

<div align = "center">图 2-2 数据类型的分类</div>

**注意事项**

- 引用数据类型的大小统一为 4 个字节，记录的是其引用对象的地址！
- 本章只讲解基本数据类型。引用数据类型在后续数组和面向对象章节讲解。

### 2.6.1	整型变量/常量

​		整型用于表示没有小数部分的数值，它允许是负数。整型的范围与运行 Java 代码的机器无关，这正是 Java 程序具有很强移植能力的原因之一。与此相反，C 和 C++ 程序需要针对不同的处理器选择最有效的整型。

<div align = "center">表 2-4 整型数据类型</div>

| **类型** | **占用存储空间** | **表数范围**                                 |
| :------- | :--------------: | :------------------------------------------- |
| byte     |      1字节       | -27 ~  27-1（-128~127）                      |
| short    |      2字节       | -215 ~  215-1（-32768~32767）                |
| int      |      4字节       | -231 ~  231-1 (-2147483648~2147483647)约21亿 |
| long     |      8字节       | -263 ~  263-1                                |

**Java 语言整型常量的四种表示形式**

- 十进制整数，如：99, -500, 0
- 八进制整数，要求以 0 开头，如：015
- 十六进制数，要求 0x 或 0X 开头，如：0x15
- 二进制数，要求 0b 或 0B 开头，如：0b01110011

Java 语言的整型常数默认为 int 型，声明 long 型常量可以后加 ‘ l ’ 或 ‘ L ’ 。

**【示例2-10】长整型常数的声明**

```java
long a = 55555555;  //编译成功，在int表示的范围内(21亿内)。
long b = 55555555555;//不加L编译错误，已经超过int表示的范围。
```

**我们修改成 long 类型的常量即可：**

```java
long b = 55555555555L;
```



### 2.6.2	浮点型变量/常量

​		带小数的数据在 Java 中称为浮点型。浮点型可分为 float 类型和 double 类型。

<div align = "center">表 2-5 浮点型数据类型</div>

| **类型** | **占用存储空间** | **表数范围**         |
| -------- | ---------------- | -------------------- |
| float    | 4字节            | -3.403E38~3.403E38   |
| double   | 8字节            | -1.798E308~1.798E308 |

​		float 类型又被称作单精度类型，尾数可以精确到 7 位有效数字，在很多情况下，float 类型的精度很难满足需求。而 double 表示这种类型的数值精度约是 float 类型的两倍，又被称作双精度类型，绝大部分应用程序都采用 double 类型。浮点型常量默认类型也是double。

**Java 浮点类型常量有两种表示形式**

- 十进制数形式，例如: 3.14    314.0    0.314 
- 科学记数法形式，如: 314e2    314E2    314E-2 

**【示例2-11】使用科学记数法给浮点型变量赋值**

```java
double f = 314e2;  //314*10^2-->31400.0
double f2 = 314e-2; //314*10^(-2)-->3.14
```

**【示例2-12】float 类型赋值时需要添加后缀 F/f**

```java
float  f = 3.14F;
double d1  = 3.14;
double d2 = 3.14D;
```

> **老鸟建议**
>
> ​		浮点类型 float，double 的数据不适合在不容许舍入误差的金融计算领域。如果需要进行不产生舍入误差的精确数字计算，需要使用 BigDecimal 类。

**【示例2-13】浮点数的比较一** 

```java
float f = 0.1f;
double d = 1.0/10;
System.out.println(f==d);//结果为false
```

**【示例2-14】浮点数的比较二**

```java
float d1 = 423432423f;
float d2 = d1+1;
if(d1==d2){
   System.out.println("d1==d2");//输出结果为d1==d2
}else{
    System.out.println("d1!=d2");
}
```

​		运行以上两个示例，发现示例 2-13 的结果是 “false” ，而示例 2-14 的输出结果是 “d1==d2” 。这是因为由于字长有限，浮点数能够精确表示的数是有限的，因而也是离散的。 浮点数一般都存在舍入误差，很多数字无法精确表示(例如0.1)，其结果只能是接近， 但不等于。二进制浮点数不能精确的表示0.1、0.01、0.001这样 10 的负次幂。并不是所有的小数都能可以精确的用二进制浮点数表示。

​		java.math 包下面的两个有用的类：BigInteger 和 BigDecimal，这两个类可以处理任意长度的数值。BigInteger 实现了任意精度的整数运算。BigDecimal 实现了任意精度的浮点运算。

> **菜鸟雷区**
>
> 不要使用浮点数进行比较！很多新人甚至很多理论不扎实的有工作经验的程序员也会犯这个错误！需要比较请使用 BigDecimal 类

**【示例2-15】使用BigDecimal进行浮点数的比较**

```java
import java.math.BigDecimal;
public class Main {
    public static void main(String[] args) {
        BigDecimal bd = BigDecimal.valueOf(1.0);
        bd = bd.subtract(BigDecimal.valueOf(0.1));
        bd = bd.subtract(BigDecimal.valueOf(0.1));
        bd = bd.subtract(BigDecimal.valueOf(0.1));
        bd = bd.subtract(BigDecimal.valueOf(0.1));
        bd = bd.subtract(BigDecimal.valueOf(0.1));
        System.out.println(bd);//0.5
        System.out.println(1.0 - 0.1 - 0.1 - 0.1 - 0.1 - 0.1);//0.5000000000000001
    }
}
```

**浮点数使用总结**

- 默认是 double 类型
- 浮点数存在舍入误差，数字不能精确表示。如果需要进行不产生舍入误差的精确数字计算，需要使用 **BigDecimal类。**
- 避免比较中使用浮点数，需要比较请使用 BigDecimal 类



### 2.6.3	字符型变量/常量

​		字符型在内存中占 2 个字节，在 Java 中使用单引号来表示字符常量。例如 ’A’ 是一个字符，它与 ”A” 是不同的，”A” 表示含有一个字符的字符串。

​		char 类型用来表示在 Unicode 编码表中的字符。Unicode 编码被设计用来处理各种语言的文字，它占 2 个字节，可允许有 65536 个字符。

**【示例2-16】字符型举例**

```java
char eChar = 'a'; 
char cChar = '中';
```

​		Unicode 具有从 0 到 65535 之间的编码，他们通常用从 ’\u0000’ 到 ’\uFFFF’ 之间的十六进制值来表示（前缀为 u 表示 Unicode）

**【示例2-17】字符型的十六进制值表示方法**

```java
char c = '\u0061';
```

​		Java 语言中还允许使用转义字符 ‘\’ 来将其后的字符转变为其它的含义。常用的转义字符及其含义和 Unicode 值如表 2-6 所示。

**【示例2-18】转义字符**

```java
char c2 = '\n';  //代表换行符
```

<div align = "center">表 2-6 转义字符</div>

| 转义符 | 含义              | Unicode 值 |
| ------ | ----------------- | ---------- |
| \b     | 退格（backspace） | \u0008     |
| \n     | 换行              | \u000a     |
| \r     | 回车              | \u000d     |
| \t     | 制表符（tab）     | \u0009     |
| \“     | 双引号            | \u0022     |
| \‘     | 单引号            | \u0027     |
| \\     | 反斜杠            | \u005c     |

**注意事项**

- 以后我们学的 String 类，其实是字符序列(char sequence)。

**课堂代码**

```java
/**
 * 测试字符类型
 * @author 高淇
 *
 */
public class TestPrimitiveDataType3 {
    public static void main(String[] args) {
        char  a = 'T';
        char  b = '尚';
        char c = '\u0061';
        System.out.println(c);
         
        //转义字符
        System.out.println(""+'a'+'\n'+'b'); 
        System.out.println(""+'a'+'\t'+'b'); 
        System.out.println(""+'a'+'\''+'b');        //a'b 
         
         
        //String就是字符序列
        String  d = "abc";
         
    }
}
```



### 2.6.4	boolean 类型变量/常量

​		boolean 类型有两个常量值，true 和 false，在内存中占一位（不是一个字节），不可以使用 0 或非 0 的整数替代 true 和 false ，这点和 C 语言不同。 boolean 类型用来判断逻辑条件，一般用于程序流程控制 。

**【示例2-19】boolean类型**

```java
boolean flag ;
flag = true;   //或者 flag = false;
	if(flag) {
    	// true分支
	} else {
    	//  false分支
    }
```

> **老鸟建议**
>
> ​		Less is More！！请不要这样写：if ( flag == true )，只有新手才那么写。关键也很容易写错成 if (flag = true)，这样就变成赋值flag 为 true 而不是判断！老鸟的写法是 if (flag) 或者 if (!flag)



## 2.7	运算符(operator)

​		计算机的最基本用途之一就是执行数学运算，作为一门计算机语言，Java 也提供了一套丰富的运算符来操作变量。

<div align = "center">表 2-7 运算符分类</div>

| 含义         | 运算符                                                  |
| ------------ | ------------------------------------------------------- |
| 算术运算符   | ++，-- （一元运算符）      +，-，*，/，%（ 二元运算符） |
| 赋值运算符   | =                                                       |
| 扩展运算符   | +=，-=，*=，/=                                          |
| 关系运算符   | >，<，>=，<=，==，!=  instanceof                        |
| 逻辑运算符   | &&，\|\|，!，^                                          |
| 位运算符     | &，\|，^，~ ， >>，<<，>>>                              |
| 条件运算符   | ? :                                                     |
| 字符串连接符 | +                                                       |

### 2.7.1	算术运算符

​		算术运算符中 +，-，*，/，% 属于二元运算符，二元运算符指的是需要两个操作数才能完成运算的运算符。其中的 % 是取模运算符，就是我们常说的求余数操作。

**二元运算符的运算规则：**

**整数运算：**

1. 如果两个操作数有一个为 long , 则结果也为 long。

2. 没有 long 时，结果为 int 。即使操作数全为 short，byte，结果也是 int。

**浮点运算：**

3. 如果两个操作数有一个为 double，则结果为 double。

4. 只有两个操作数都是 float，则结果才为 float。

**取模运算：**

1. 其操作数可以为浮点数, 一般使用整数，结果是 “余数”，“余数” 符号和左边操作数相同，如：7%3=1，-7%3=-1，7%-3=1。

算术运算符中 ++，-- 属于一元运算符，该类运算符只需要一个操作数。

**【示例2-20】一元运算符 ++ 与 --**

```java
int a = 3;
int b = a++;   //执行完后,b=3。先给b赋值，再自增。
System.out.println("a="+a+"\nb="+b);
a = 3;
b = ++a;   //执行完后,b=4。a先自增，再给c赋值
System.out.println("a="+a+"\nb="+b);
/*
运行结果为：
a=4
b=3
a=4
b=4

*/
```



### 2.7.2	赋值及其扩展赋值运算符

<div align = "center">表 2-8 赋值及其扩展运算符</div>

| 运算符 | 用法举例 | 等效的表达式 |
| ------ | -------- | ------------ |
| +=     | a += b   | a = a+b      |
| -=     | a -= b   | a = a-b      |
| *=     | a *= b   | a = a*b      |
| /=     | a /= b   | a = a/b      |
| %=     | a %= b   | a = a%b      |

**【示例2-21】扩展运算符**

```java
int a=3;
int b=4;
a+=b;//相当于a=a+b;
System.out.println("a="+a+"\nb="+b);
a=3;
a*=b+3;//相当于a=a*(b+3)
System.out.println("a="+a+"\nb="+b);
/*
运行结果为：
a=7
b=4
a=21
b=4

*/
```



### 2.7.3	关系运算符

​		关系运算符用来进行比较运算，如表 2-9 所示。关系运算的结果是布尔值：true/false；

<div align = "center">表2-9 关系运算符</div>

| 运算符 | 含义       | 示例 |
| ------ | ---------- | ---- |
| ==     | 等于       | a==b |
| !=     | 不等于     | a!=b |
| >      | 大于       | a>b  |
| <      | 小于       | a<b  |
| >=     | 大于或等于 | a>=b |
| <=     | 小于或等于 | a<=b |

**注意事项**

- = 是赋值运算符，而真正的判断两个操作数是否相等的运算符是 ==。
- ==、!= 是所有（基本和引用）数据类型都可以使用
- \> 、>=、 <、 <= 仅针对数值类型（byte/short/int/long, float/double。以及 char）



### 2.7.4	逻辑运算符

​		Java中的逻辑运算符如表 2-10 所示。逻辑运算的操作数和运算结果都是 boolean 值。

<div align = "center">表 2-10 逻辑运算符</div>

| 运算符   | 说明      |                                                |
| -------- | --------- | ---------------------------------------------- |
| 逻辑与   | &( 与)    | 两个操作数为 true，结果才是 true，否则是 false |
| 逻辑或   | \|(或)    | 两个操作数有一个是 true，结果就是 true         |
| 短路与   | &&( 与)   | 只要有一个为 false，则直接返回 false           |
| 短路或   | \|\|(或)  | 只要有一个为 true， 则直接返回 true            |
| 逻辑非   | !（非）   | 取反：!false 为 true，!true 为 false           |
| 逻辑异或 | ^（异或） | 相同为 false，不同为 true                      |

​		短路与和短路或采用短路的方式。从左到右计算，如果只通过运算符左边的操作数就能够确定该逻辑表达式的值，则不会继续计算运算符右边的操作数，提高效率。

**【示例2-22】短路与和逻辑与**

```java
//1>2的结果为false，那么整个表达式的结果即为false，将不再计算2>(3/0)
boolean c = 1>2 && 2>(3/0);
System.out.println(c);
//1>2的结果为false，那么整个表达式的结果即为false，还要计算2>(3/0)，0不能做除数，//会输出异常信息
boolean d = 1>2 & 2>(3/0);
System.out.println(d);
```



### 2.7.5	位运算符

​		位运算指的是进行二进制位的运算，常用的位运算符如表 2-11 所示。

<div align = "center">表2-11 位运算符</div>

| 位运算符 | 说明                             |
| -------- | -------------------------------- |
| ~        | 取反                             |
| &        | 按位与                           |
| \|       | 按位或                           |
| ^        | 按位异或                         |
| <<       | 左移运算符，左移1位相当于乘2     |
| >>       | 右移运算符，右移1位相当于除2取商 |

**【示例2-23】左移运算和右移运算**

```java
int a = 3*2*2;
int b = 3<<2; //相当于：3*2*2;
int c = 12/2/2;
int d = 12>>2; //相当于12/2/2;
```

> 　　**雷区**
>
> 　  　	1. & 和 | 既是逻辑运算符，也是位运算符。如果两侧操作数都是 boolean 类型，就作为逻辑运算符。如果两侧的操作数是整数类型，就是位运算符。
>
> 　  　	2. 不要把 “^” 当做数学运算 “乘方”，是 “位的异或” 操作。



### 2.7.6	字符串连接符

​		"+" 运算符两侧的操作数中只要有一个是字符串 String 类型，系统会自动将另一个操作数转换为字符串然后再进行连接。

**【示例2-24】连接符 “+”**

```java
int a=12;
System.out.println("a="+a);//输出结果: a=12
```



### 2.7.7	条件运算符

**语法格式：**

```java
x ? y : z
//其中 x 为 boolean 类型表达式，先计算 x 的值，若为 true，则整个运算的结果为表达式 y 的值，否则整个运算结果为表达式 z 的值。
```

**【示例2-25】三目条件运算符**

```java
int score = 80; 
int x = -100;
String type = score < 60 ? "不及格" : "及格"; 
int flag = x > 0 ? 1 : (x == 0 ? 0 : -1);
System.out.println("type = " + type);
System.out.println("flag = "+ flag);
/*
运算结果为：
type = 及格
flag = -1

*/
```



### 2.7.8	运算符优先级的问题

<div align = "center">表 2-12 运算符的优先级</div>

| 优先级 | 运算符                  | 类                     | 结合性   |
| ------ | ----------------------- | ---------------------- | -------- |
| 1      | ()                      | 括号运算符             | 由左至右 |
| 2      | !、+（正号）、-（负号） | 一元运算符             | 由左至右 |
| 2      | ~                       | 位逻辑运算符           | 由右至左 |
| 2      | ++、--                  | 递增与递减运算符       | 由右至左 |
| 3      | *、/、%                 | 算术运算符             | 由左至右 |
| 4      | +、-                    | 算术运算符             | 由左至右 |
| 5      | <<、>>                  | 位左移、右移运算符     | 由左至右 |
| 6      | >、>=、<、<=            | 关系运算符             | 由左至右 |
| 7      | ==、!=                  | 关系运算符             | 由左至右 |
| 8      | &                       | 位运算符、逻辑运算符   | 由左至右 |
| 9      | ^                       | 位运算符、逻辑运算符   | 由左至右 |
| 10     | \|                      | 位运算符、逻辑运算符   | 由左至右 |
| 11     | &&                      | 逻辑运算符             | 由左至右 |
| 12     | \|\|                    | 逻辑运算符             | 由左至右 |
| 13     | ? :                     | 条件运算符             | 由右至左 |
| 14     | =、+=、-=、*=、/=、%=   | 赋值运算符、扩展运算符 | 由右至左 |

> **老鸟建议**
>
> - 大家不需要去刻意的记这些优先级，表达式里面优先使用小括号来组织！！
> - 逻辑与、逻辑或、逻辑非的优先级一定要熟悉！（逻辑非>逻辑与>逻辑或）。如：
> - a||b&&c的运算结果是：a||(b&&c)，而不是(a||b)&&c 



## 2.8	基本类型转换

### 2.8.1	自动类型转换

​		自动类型转换指的是容量小的数据类型可以自动转换为容量大的数据类型。如图 2-6 所示，黑色的实线表示无数据丢失的自动类型转换，而虚线表示在转换时可能会有精度的损失。

E:\target\java\2.8.1自动类型转换.png

<div align = "center">图 2-6 自动类型转换</div>

​		可以将整型常量直接赋值给byte、 short、 char等类型变量，而不需要进行强制类型转换，只要不超出其表数范围即可。

**【示例2-26】自动类型转换特例**

```java
short  b = 12;  //合法
short  b = 1234567;//非法，1234567超出了short的表数范围
```



### 2.8.2	强制类型转换

​		强制类型转换，又被称为造型，用于显式的转换一个数值的类型。在有可能丢失信息的情况下进行的转换是通过造型来完成的，但可能造成精度降低或溢出。

**语法格式：**

```java
(type)var	//运算符“()”中的 type 表示将值 var 想要转换成的目标数据类型。
```

**【示例2-27】强制类型转换**

```java
double x  = 3.14; 
int nx = (int)x;   //值为3
char c = 'a';
int d = c+1;
System.out.println(nx);
System.out.println(d);
System.out.println((char)d);
/*
运行结果为：
3
98
b

*/
```

​		当将一种类型强制转换成另一种类型，而又超出了目标类型的表数范围，就会被截断成为一个完全不同的值。

**【示例2-28】强制类型转换特例**

```java
int x = 300;
byte bx = (byte)x;    //值为44
```

> **新手雷区**
>
> ****不能在布尔类型和任何数值类型之间做强制类型转换



### 2.8.3	基本类型转换时常见错误和问题

​		操作比较大的数时，要留意是否溢出，尤其是整数操作时。

**【示例2-29】常见问题一**

```java
int money = 1000000000; //10亿
int years = 20;
//返回的total是负数，超过了int的范围
int total = money*years;
System.out.println("total="+total);
//返回的total仍然是负数。默认是int，因此结果会转成int值，再转成long。但是已经发生//了数据丢失
long total1 = money*years; 
System.out.println("total1="+total1);
//返回的total2正确:先将一个因子变成long，整个表达式发生提升。全部用long来计算。
long total2 = money*((long)years); 
System.out.println("total2="+total2);
/*
运行结果为：
total=-1474836480
total1=-1474836480
total2=20000000000

*/
```

​		L 和 l 的问题：不要命名名字为 l 的变量，l 容易和 1 混淆。long 类型使用大写 L 不要用小写。

**【示例2-30】常见问题二**

```java
int l = 2; //分不清是L还是1,
long a = 23451l;//建议使用大写L
System.out.println(l+1);
```



## 2.9	简单的键盘输入和输出

​		为了我们能写出更加复杂的程序，可以让我们的程序和用户可以通过键盘交互，我们先学习一下简单的键盘输入和输出。

**【示例2-31】使用Scanner获取键盘输入**

```java
import  java.util.Scanner;
/**
 * 测试获得键盘输入
 * @author 高淇
 *
 */
public class TestScanner {
    public static void main(String[] args) {
        Scanner   scanner =  new Scanner(System.in);
        System.out.println("请输入名字：");
        String   name =  scanner.nextLine();
        System.out.println("请输入你的爱好：");
        String  favor = scanner.nextLine();
        System.out.println("请输入你的年龄：");
        int   age = scanner.nextInt();
         
        System.out.println("###############");
        System.out.println(name);
        System.out.println(favor);
        System.out.println("来到地球的天数："+age*365);
        System.out.println("离开地球的天数："+(72-age)*365);
         
    }
}
```

E:\target\java\2.9运行结果.png



## 第二章总结

1.注释可以提高程序的可读性。可划分为

2.单行注释  //

3.多行注释  /*...*/

4.文档注释  /**...*/

5.标识符的命名规则：

6.标识符必须以字母、下划线_、美元符号$开头。  

7.标识符其它部分可以是字母、下划线“_”、美元符“$”和数字的任意组合。

8.Java 标识符大小写敏感，且长度无限制。

9.标识符不可以是Java的关键字。

10.标识符的命名规范

11.表示类名的标识符：每个单词的首字母大写，如Man, GoodMan

12.表示方法和变量的标识符：第一个单词小写，从第二个单词开始首字母大写，我们称之为“驼峰原则”，如eat(), eatFood()

13.变量的声明格式：

type  varName  [=value] [,varName[=value]...];

14.变量的分类：局部变量、实例变量、静态变量

15.常量的声名格式

final  type  varName = value ;

16.Java的数据类型可分为基本数据类型和引用数据类，基本数据类型的分类如下：

17.整型变量：byte、short、int、long

18.浮点型：float、double

19.字符型：char

20.布尔型:boolean，值为true或者false

21.Java语言支持的运算符可分为：

22.算术运算符:  +，-，*，/，%，++，--

23.赋值运算符 = 

24.扩展赋值运算符:+=，-=，*=，/= 

25.关系运算符:  >，<，>=，<=，==，!= ，instanceof

26.逻辑运算符:  &&，||，!

27.位运算符:  &，|，^，~ ， >>，<<，>>> 

28.字符串连接符：+

29.条件运算符 ？： 

30.基本数据类型的类型转换可分为：

31.自动类型转换：容量小的数据类型可以自动转换为容量大的数据类型

32.强制类型转换：用于显式的转换一个数值的类型，语法格式：(type)var

33.键盘的输入：Scanner类的使用



# 第三章	控制语句

## 3.1	选择结构

​		在还没有知道 Java 选择结构的时候，我们编写的程序总是从程序入口开始，顺序执行每一条语句直到执行完最后一条语句结束，但是生活中经常需要进行条件判断，根据判断结果决定是否做一件事情，这就需要选择结构。

​		选择结构用于判断给定的条件，然后根据判断的结果来控制程序的流程。

​		主要的选择结构有：if选择结构和switch多选择结构。有如下结构：

1. if单选择结构
2. if-else双选择结构
3. if-else if-else多选择结构
4. switch结构



### 3.1.1	if 单选择结构

**语法结构:**

```java
if(布尔表达式){
	语句块
}
```

if语句对布尔表达式进行一次判定，若判定为真，则执行 { } 中的语句块，否则跳过该语句块。流程图如图3-1所示。

**图3-1 if 单选择结构流程图**

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494915015552935.png)

**【示例3-1】if 单选择结构**

```java
public class Test1 {
	public static void main(String[] args) {
	//通过掷三个骰子看看今天的手气如何？
	int i = (int)(6 * Math.random()) + 1;//通过Math.random()产生随机数
    int j = (int)(6 * Math.random()) + 1;
    int k = (int)(6 * Math.random()) + 1;
    int count = i + j + k;
    //如果三个骰子之和大于15，则手气不错
    if(count > 15) {
        System.out.println("今天手气不错");
    }
	//如果三个骰子之和在10到15之间，则手气一般
    if(count >= 10 && count <= 15) { //错误写法：10<=count<=15
    	System.out.println("今天手气很一般");
    }
    //如果三个骰子之和小于10，则手气不怎么样
    if(count < 10) {
        System.out.println("今天手气不怎么样");
    }
    System.out.println("得了" + count + "分");
    }
}
```



![图片1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170517/1494983790710364.png)

图3-2 示例3-1运行效果图

**Math类的使用**

   1**.**java.lang 包中的 Math 类提供了一些用于数学计算的方法。

   2.Math.random() 该方法用于产生一个0到1区间的double类型的随机数，但是不包括1。

​		int i = (int) (6 * Math.random()); //产生：[0，5]之间的随机整数

**新手雷区**

   1.如果 if 语句不写 { }，则只能作用于后面的第一条语句。 

   2.强烈建议，任何时候都写上 { }，即使里面只有一句话！



### 3.1.2	if-else 双选择结构

**语法结构:**

```java
if(布尔表达式){
	语句块1
}
else{
	语句块2
}
```

   当布尔表达式为真时，执行语句块1，否则，执行语句块2。也就是else部分。流程图如图3-3所示。

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494917663543171.png)

图3-3 if-else 双选择结构流程图

**【示例3-2】if-else 结构**

```java
public class Test2 {
    public static void main(String[] args) {
        //随机产生一个[0.0, 4.0)区间的半径，并根据半径求圆的面积和周长
        double r = 4 * Math.random();
       //Math.pow(r, 2)求半径r的平方
        double area = Math.PI * Math.pow(r, 2);
        double circle = 2 * Math.PI * r;
        System.out.println("半径为： " + r);
        System.out.println("面积为： " + area);
        System.out.println("周长为： " + circle);
        //如果面积>=周长，则输出"面积大于等于周长"，否则，输出周长大于面积
        if(area >= circle) {
            System.out.println("面积大于等于周长");
        } else {
            System.out.println("周长大于面积");
        }
    }
}
```



![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494917747605880.png)

图3-4 示例3-2运行效果图

   条件运算符有时候可用于代替 if-else，如示例3-3与示例3-4所示。

**【示例3-3】使用if-else**

```java
public class Test3 {
    public static void main(String[] args) {
        int a=2; 
        int b=3;
        if (a<b) {
            System.out.println(a);
        } else {
            System.out.println(b);
        }
    }
}
```



![3.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494917807854177.png)

图3-5 示例3-3运行效果图

**【示例3-4】使用条件运算符**

```java
public class Test4 {
    public static void main(String[] args) {
        int a=2;
        int b=3;
        System.out.println((a<b)?a:b);
    }
}
```



![4.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494917862967746.png)

图3-6 示例3-4运行效果图



### 3.1.3	if-else if-else 多选择结构

**语法结构：**

```java
if(布尔表达式1) {
语句块1;
} else if(布尔表达式2) {
语句块2;
}……
else if(布尔表达式n){
    语句块n;
} else {
    语句块n+1;
}
```

   当布尔表达式1为真时，执行语句块1;否则，判断布尔表达式2，当布尔表达式2为真时，执行语句块2;否则，继续判断布尔表达式3······;如果1~n个布尔表达式均判定为假时，则执行语句块n+1，也就是else部分。流程图如图3-7所示。

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918202257279.png)

图3-7 if-else if-else多选择结构流程图

**【示例3-5】if-else if-else多选择结构**

```java
public class Test5 {
    public static void main(String[] args) {
        int age = (int) (100 * Math.random());
        System.out.print("年龄是" + age + "， 属于");
        if (age < 15) {
            System.out.println("儿童， 喜欢玩！");
        } else if (age < 25) {
            System.out.println("青年， 要学习！");
        } else if (age < 45) {
            System.out.println("中年， 要工作！");
        } else if (age < 65) {
            System.out.println("中老年， 要补钙！");
        } else if (age < 85) {
            System.out.println("老年， 多运动！");
        } else {
            System.out.println("老寿星， 古来稀！");
        }
    }
}
```

　　

![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918283781121.png)

图3-8 示例3-5运行效果图1

![3.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918291733484.png)

图3-9 示例3-5运行效果图2

**课堂练习**

**仿照【示例3-5】，实现如下功能：**

   随机生成一个100以内的成绩，当成绩在85及以上的时候输出”等级A”，70以上到84之间输出”等级B”，60到69之间输出”等级C”，60以下输出”等级D”。



### 3.1.4 switch 多选择结构

**语法结构：**　

```java
switch (表达式) {
case 值1: 
语句序列1;
[break];
case 值2:
 语句序列2;
[break];
     … … …      … …
[default:
 默认语句;]
}
```

   switch语句会根据表达式的值从相匹配的case标签处开始执行，一直执行到break语句处或者是switch语句的末尾。如果表达式的值与任一case值不匹配，则进入default语句(如果存在default语句的情况)。

   根据表达式值的不同可以执行许多不同的操作。switch语句中case标签在JDK1.5之前必须是整数(long类型除外)或者枚举，不能是字符串，在JDK1.7之后允许使用字符串(String)。

   大家要注意，当布尔表达式是等值判断的情况，可以使用if-else if-else多选择结构或者switch结构，如果布尔表达式区间判断的情况，则只能使用if-else if-else多选择结构。

   switch多选择结构的流程图如图3-10所示。

　　

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918663569372.png)



图3-10 switch多选择结构流程图

**【示例3-6】switch结构**

```java
public class Test6 {
    public static void main(String[] args) {
        char c = 'a';
        int rand = (int) (26 * Math.random());
        char c2 = (char) (c + rand);
        System.out.print(c2 + ": ");
        switch (c2) {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
            System.out.println("元音");
            break;
        case 'y':
        case 'w':
            System.out.println("半元音");
            break;
        default:
            System.out.println("辅音");
        }
    }
}
```



![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918740540880.png)

图3-11 示例3-6运行效果图1

![3.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494918747692225.png)

图3-12 示例3-6运行效果图2



## 3.2	循环结构

循环结构分两大类，一类是当型，一类是直到型。

**当型：**

当布尔表达式条件为true时，反复执行某语句，当布尔表达式的值为 false 时才停止循环，比如：while 与 for 循环。

**直到型：**

先执行某语句， 再判断布尔表达式，如果为 true，再执行某语句，如此反复，直到布尔表达式条件为 false 时才停止循环，比如 do-while 循环。



### 3.2.1	while 循环

**语法结构：**　

```java
while (布尔表达式) {
    循环体;
}
```

   在循环刚开始时，会计算一次“布尔表达式”的值，若条件为真，执行循环体。而对于后来每一次额外的循环，都会在开始前重新计算一次。

   语句中应有使循环趋向于结束的语句，否则会出现无限循环–––"死"循环。

   while循环结构流程图如图3.13所示。

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919125339101.png)

图3-13 while流程图

**【示例3-7】while循环结构：求1到100之间的累加和**

```java
public class Test7 {
    public static void main(String[] args) {
        int  i = 0;
        int  sum = 0;
        // 1+2+3+…+100=?
        while (i <= 100) {
            sum += i;//相当于sum = sum+i;
            i++;
        }
        System.out.println("Sum= " + sum);
    }
}
```



![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919188264576.png)

图3-14 示例3-7运行效果图



### 3.2.2	do-while 循环

**语法结构：**

```java
do {
        循环体;
     } while(布尔表达式) ;
```

   do-while循环结构会先执行循环体，然后再判断布尔表达式的值，若条件为真，执行循环体，当条件为假时结束循环。do-while循环的循环体至少执行一次。do-while循环结构流程图如图3.15所示。

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919347187056.png)

图3-15 do-while流程图

**【示例3-8】do-while循环结构：1-100之间的累加和**

```java
public class Test8 {
    public static void main(String[] args) {
        int i = 0;
        int sum = 0;
        do {
            sum += i; // sum = sum + i
            i++;
        } while (i <= 100);//此处的；不能省略
        System.out.println("Sum= " + sum);
    }
}
```

　

![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919404947497.png)

图3-16 示例3-8运行效果图

**【示例3-9】while与do-while的区别**

```java
public class Test9 {
    public static void main(String[] args) {
        //while循环：先判断再执行
        int a = 0;
        while (a < 0) {
            System.out.println(a);
            a++;
        }
        System.out.println("-----");
        //do-while循环：先执行再判断
        a = 0;
        do {
            System.out.println(a);
            a++;
        } while (a < 0);
    }
}
```



![3.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919475143305.png)

图3-17 示例3-9运行效果图

   从运行效图中可以看出do-while总是保证循环体至少会被执行一次!



### 3.2.3	for 循环

**语法结构：**　　

```java
for (初始表达式; 布尔表达式; 迭代因子) {
      循环体;
}
```

   for循环语句是支持迭代的一种通用结构，是最有效、最灵活的循环结构。for循环在第一次反复之前要进行初始化，即执行初始表达式;随后，对布尔表达式进行判定，若判定结果为true，则执行循环体，否则，终止循环;最后在每一次反复的时候，进行某种形式的“步进”，即执行迭代因子。

   A. 初始化部分设置循环变量的初值

   B. 条件判断部分为任意布尔表达式

   C. 迭代因子控制循环变量的增减

   for循环在执行条件判定后，先执行的循环体部分，再执行步进。

   for循环结构的流程图如图3-18所示。

![1.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919708427157.png)

图3-18 for循环流程图

**【示例3-10】for循环**　　

```java
public class Test10 {
    public static void main(String args[]) {
        int sum = 0;
        //1.求1-100之间的累加和
        for (int i = 0; i <= 100; i++) {
            sum += i;
        }
        System.out.println("Sum= " + sum);
        //2.循环输出9-1之间的数
        for(int i=9;i>0;i--){
            System.out.print(i+"、");
        }
        System.out.println();
        //3.输出90-1之间能被3整除的数
        for(int i=90;i>0;i-=3){
            System.out.print(i+"、");
        }
        System.out.println();
    }
}
```



![2.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919882344126.png)

图3-19 示例3-10运行效果图

   Java里能用到逗号运算符的地方屈指可数，其中一处就是for循环的控制表达式。在控制表达式的初始化和步进控制部分，我们可以使用一系列由逗号分隔的表达式，而且那些表达式均会独立执行。

**【示例3-11】逗号运算符**　

```java
public class Test11 {
    public static void main(String[] args) { 
        for(int i = 1, j = i + 10; i < 5; i++, j = i * 2) {
            System.out.println("i= " + i + " j= " + j); 
        } 
    }
}
```



![3.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494919920133938.png)

图3-20 示例3-11运行效果图

   \1. 无论在初始化还是在步进部分，语句都是顺序执行的。

   \2. 尽管初始化部分可设置任意数量的定义，但都属于同一类型。

   \3. 约定:只在for语句的控制表达式中写入与循环变量初始化，条件判断和迭代因子相关的表达式。

   初始化部分、条件判断部分和迭代因子可以为空语句，但必须以“;”分开，如示例3-12所示。

**【示例3-12】无限循环**

```java
public class Test12 {
    public static void main(String[] args) { 
        for ( ; ; ) {    // 无限循环: 相当于 while(true)
            System.out.println("北京尚学堂");
        }
    }
}
```

   编译器将while(true)与for(;;)看作同一回事，都指的是无限循环。

   在for语句的初始化部分声明的变量，其作用域为整个for循环体，不能在循环外部使用该变量。如示例3-13所示。

**【示例3-13】初始化变量的作用域**

![4.png](https://www.sxt.cn/360shop/Public/admin/UEditor/20170516/1494920002726434.png)















# 第四章









环境变量
招聘网站
JDK下载和安装

JavaSE（Java语言的标准版），用于桌面应用的开发，是其它两个版本的基础
JavaEE（Java语言的企业版），用于Web方向的网站开发
JavaME（Java语言的小型版），用于嵌入式电子设备或小型移动设备

JDK JRE JVM

文档注释 自动生成文档


# DOS命令

day01

# 文本编辑器、计算机编程语言发展史

day02



# Java 特性

Java特性：健壮性、可移植性（Java虚拟机屏蔽了操作系统之间的差异）、……
JDK：Java开发工具箱、JRE：Java运行环境、JVM：Java虚拟机
Java程序编写编译运行流程

# 环境变量

day04
环境变量path、java和javac命令、tomcat需要配置JAVA_HOME环境变量
java程序执行过程以及原理：
我们一起来研究一下：“java HelloWorld”的执行过程以及原理。
	D:\course\JavaProjects\02-JavaSE\chapter01>java HelloWorld
	敲完回车，都发生了什么？？？？？
		第一步：会先启动JVM（java虚拟机）
		第二步：JVM启动之后，JVM会去启动“类加载器classloader”
		类加载器的作用：加载类的。本质上类加载器负责去硬盘上找“类”对应的“字节码”文件。
		假设是“java HelloWorld”，那么类加载器会去硬盘上搜索：HelloWorld.class文件。
		假设是“java Test”，那么类加载器会去硬盘上搜索：Test.class文件。
		.......
		第三步：
			类加载器如果在硬盘上找不到对应的字节码文件，会报错，报什么错？
				错误: 找不到或无法加载主类
			类加载器如果在硬盘上找到了对应的字节码文件，类加载器会将该字节码
			文件装载到JVM当中，JVM启动“解释器”将字节码解释为“101010000...”这种
			二进制码，操作系统执行二进制码和硬件交互。
类加载器默认在当前路径下加载类，可以设置一个环境变量classpath指定类加载器的加载路径
	
文档注释可以通过javadoc命令生成帮助文档

public 修饰的类在一个.java文件中只能有一个，而且要和文件名一致
程序的入口main方法可以定义在任何类里，一个类里面只能有一个main方法


# 标识符、关键字、字面量、变量

day05

# 数据类型

day06
数据类型：
基本数据类型：四大类八小种：整数型：byte，short，int，long；浮点型：float，double；布尔型：boolean；字符型：char；
引用数据类型：除基本数据类型以外的数据类型
编码与解码
自动类型转换和强制类型转换
	当一个整数没有超出byte short char的取值范围，可以直接赋值，不用强转
	只有boolean不能转换，其它都行
	自动类型转换：byte < short(char) < int < long < float < double
	强制类型转换需要加强制类型转换符，可能损失精度
	byte、short、char混合运算的时候，各自先转换成int再做运算
	多种数据类型混合运算时，先转换成容量最大的那一种再做运算
整数字面量默认是int类型，浮点型字面量默认是double类型
float、double的空间永远比整数型空间大，比long大

day07

# 运算符

day08

# 选择语句、循环语句、转向语句

day09 复习前面内容（未看）

# 方法

实现代码的复用
方法执行结束后，局部变量占用的内存会自动释放（因为标识符重复，必须释放）
JVM内存结构：栈区（方法调用时压栈，方法执行结束弹栈）、堆区、方法区（代码片段）、其它
方法的重载、递归的原理（内存图分析）

# 面向对象

面向对象软件开发过程：OOA分析/OOD设计/OOP编程
面向对象三大特征：封装、继承、多态
类和对象：类是对象的抽象，对象是类的实例
创建对象对应的JVM内存结构：
	栈：方法调用时分配栈空间（压栈），主要存储方法中的局部变量（基本数据类型存储数据本身，引用数据类型存储数据引用）
	堆：凡是通过new运算符创建的对象，都存储在堆内存中，new运算符的作用就是在堆内存中开辟一块空间
	方法区：存储代码片段，静态区，最先有数据

# day13

垃圾回收器主要针对堆内存
构造方法（构造器）：当类中没有定义构造方法，系统自动提供缺省构造器，当类中定义了构造方法，系统将不再提供
封装：属性私有化，对外提供操作入口

# static

实例变量、实例方法：不带static，创建对象后通过“引用.”访问、调用
static关键字（静态）
	所有static修饰的都是类相关的，类级别的
	所有static修饰的，都是采用“类名.”的方式访问
	static修饰的变量：静态变量
		静态变量在类加载时初始化，不需要new对象，储存在方法区的静态区
		推荐使用“类名.”访问，可以使用“引用.”访问（引用可以为空、不建议）
	static修饰的方法：静态方法
		推荐使用“类名.”调用，可以使用“引用.”调用（引用可以为空、不建议）
	static修饰内部类
静态方法不能访问实例变量，实例方法都可以访问
静态代码块
	类加载时执行（main方法执行之前），并且只执行一次，遵循至上而下执行
	作用：记录类加载的日志信息，可以在类加载之前将日志信息打印在控制台
	可以访问静态变量
实例语句块
	对象创建时执行（构造方法执行之前）
	作用：可以将多个构造方法共同的代码片段抽取出来，写在实例语句块中
this关键字
	this是一个引用实例变量，保存当前对象的内存地址，this存储在堆内存中对象的内部
	this只能在实例方法或构造方法中使用，不能再静态方法中使用
	大部分情况下可以省略，但是用来区分局部变量和实例变量时不能省略
	this() 只能出现在构造方法的第一行，表示调用本类其他的构造方法，目的是代码复用
在同一个类中，"this."、"类名."可以省略

# 继承和重写（覆盖）

继承extends：
	子类继承父类，代码可以得到复用。因为有了继承关系，才有了方法覆盖和多态机制
	子类继承父类除构造器外的所有属性和方法
	C++支持多继承，Java不支持多继承
	Java中的类没有显示的继承任何类，默认继承Object类，Object类是Java语言的根类
注意：当源码当中一个方法以分号结尾，并且修饰符列表中有“native”关键字，
表示底层调用C++写的dll程序（dll动态链接库文件）
方法重写（覆盖）：子类重写从父类继承过来的方法
	条件一：必须要有继承关系
	条件二：返回值类型、方法名、参数列表 必须相同（其中返回值类型可以兼容子类型）
	条件三：访问权限不能更低，可以更高（访问权限从高到低：public > protected > default > private）
	条件四：重写之后的方法不能比重写之前的方法抛出更过的异常，可以更少
	注意1：方法重写只是针对于方法，和属性无关
	注意2：私有方法无法重写
	知意3：构造方法不能被继承，所有构造方法也不能被重写
	注意4：方法重写只是针对于“实例方法”，静态方法重写没有意义
关于静态方法存不存在覆盖的问题：
	子类“重写”父类的静态方法，不会覆盖，而是会隐藏

# 转型、多态、super

向上转型（子类型转为父类型、类似自动类型转换）
向下转型（父类型转为子类型、类似强制类型转换）
	想要调用子类特有的方法时，必须使用向下转型
	向下转型有风险，容易出现 java.lang.ClassCastException：类型转换异常
	可以使用 instanceof运算符 在运行阶段动态判断引用指向对象的类型，避免类型转换异常
多态：父类型的引用指向子类型的对象（向上转型）
	编译阶段：绑定父类的方法
	运行阶段：动态绑定子类对象的方法
软件开发七大原则之一：OCP开闭原则
多态在开发中的作用：降低程序的耦合度，提高程序的扩展力
super关键字
	super能出现在实例方法和构造方法中，不能出现在静态方法中
	super的语法是：“super.”、“super()”
	super.大部分情况下是可以省略的，什么时候不能省略？
	super()只能出现在构造方法第一行，调用父类中的构造方法
	目的是：创建子类对象前，先创建父类型特征
	如果一个构造方法第一行既没有this()又没有super()的话，默认会有一个super()
注意：建议手写无参数构造方法，没有无参构造器可能影响“子类对象的构建”
super内存图分析：
	super关键字代表的是“当前对象（this）”的父类型特征（super不是引用。不保存内存地址）
	调用构造方法创建对象之前，会依次调用一系列超类的构造器，初始化父类型特征
	虽然调用多个构造方法，但对象只创建了一个
	super(实参)的作用是：初始化当前对象的父类型特征
	当本类和父类出现同名属性或方法时，this.访问本类属性或方法（可以省略），super.访问父类属性或方法（不可省略）
注意：私有的属性和方法只能在本类中访问，super. 无法访问父类私有的属性和方法

# final

final关键字：表示最终的、不可变的
	final可以修饰变量、方法和类
	final修饰的类无法被继承
	final修饰的方法无法被覆盖（重写）
	final修饰变量
		final修饰的变量只能赋一次值
		如果该变量是引用数据类型，则该变量指向的内存地址（在当前方法执行结束之前）不会被垃圾回收器回收
		引用指向的对象不能修改，对象内部的数据可以修改
		final修饰实例变量，不会默认初始化，必须手动初始化（直接赋值或者在构造方法内赋值）
		final修饰的实例变量一般在前面添加static修饰。可以节省内存空间
常量：
	static和final联合修饰的变量称为“常量”
	常量名建议全部大写，单词之间采用下划线隔开
	常量和静态变量，都是存储在方法区，都是在类加载时初始化，区别在于常量的值不能修改
	常量一般都是公共的，public修饰的

抽象类：类的再次抽象
	抽象类无法实例化，无法创建对象，所以抽象类是用来被子类继承的。
		抽象类的子类可以是抽象类
		抽象类有构造方法，供子类的构造方法使用（super()）
	【修饰符列表】abstract class 类名 { 类体; }
	final和abstract不能联合使用
抽象方法：abstract修饰的方法
	没有实现的方法，既没有方法体的方法
	非抽象类继承抽象类必须将抽象方法实现（覆盖/重写）
注意：抽象类不一定有抽象方法，但抽象方法必须定义在抽象类中
面向抽象编程：abstract配合多态使用

接口interface
	接口也是一种引用数据类型，无法实例化，可以被类通过implements关键字实现（可以看作“继承”）
	接口是完全抽象的（抽象类是半抽象），或者也可以说接口是特殊的抽象类
	接口定义的语法：【修饰符列表】interface 接口名{ }
	接口支持多继承，一个接口可以继承多个接口（extends），一个类也可以实现多个接口（implements）
	接口中只包含两部分内容：常量、抽象方法
		接口中所有方法默认都是public abstract修饰的，所以public abstract可以省略
		接口中的常量默认都是public static final修饰的，所以public static final可以省略
	接口与接口之间进行类型转换不需要继承关系，但在运行时可能会抛ClassCastException类转换异常
	继承和实现可以共存，extends关键字在前，implements关键字在后
面向接口编程：interface配合多态使用。降低程序的耦合度，提高程序的扩展立
is a（继承关系）、has a（关联关系，通常以属性的形式存在）、like a（实现关系）

抽象类和接口的区别：
	抽象类要被子类继承，接口要被类实现。
	接口只能做方法声明，抽象类中可以作方法声明，也可以做方法实现。
	接口里定义的变量只能是公共的静态的常量，抽象类中的变量是普通变量。
	接口是设计的结果，抽象类是重构的结果。
	抽象类和接口都是用来抽象具体对象的，但是接口的抽象级别最高。
	抽象类可以有具体的方法和属性，接口只能有抽象方法和不可变常量。
	抽象类主要用来抽象类别，接口主要用来抽象功能。









