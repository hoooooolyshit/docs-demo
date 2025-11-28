## 初识elasticsearch

### 了解ES

**elasticsearch**

一个开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

**elastic stack（ELK）**

是以elasticsearch为核心的技术栈，包括beats、Logstash、kibana、elasticsearch

**Lucene**

是Apache的开源搜索引擎类库，提供了搜索引擎的核心API

### 正向索引和倒排索引

**文档和词条**

-   每一条数据就是一个文档
-   对文档中的内容分词，得到的词语就是词条

**正向索引**

基于文档 id 创建索引。查询词条时必须先找到文档，然后判断是否包含词条

**倒排索引**

对文档内容分词，对词条创建索引，并记录词条所在文档的信息。查询时先根据词条查询到文档 id，而后获取到文档

### es的一些概念

**文档和字段**

文档：一条数据就是一个文档，es中时json格式

字段：json文档中的字段

**索引和映射**

索引：相同类型的文档的集合

映射：索引中文档的约束，比如字段名称、类型

**mysql与elasticsearch概念对比**

| **MySQL** | **Elasticsearch** | **说明**                                                     |
| --------- | ----------------- | ------------------------------------------------------------ |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)           |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是JSON格式 |
| Column    | Field             | 字段（Field），就是JSON文档中的字段，类似数据库中的列（Column） |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema） |
| SQL       | DSL               | DSL是elasticsearch提供的JSON风格的请求语句，用来操作elasticsearch，实现CRUD |

-   数据库负责事务类型操作
-   elasticsearch负责海量数据的搜索、分析、计算

### 安装es、kibana

参考资料

### 分词器

**作用**

- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

**IK分词器的两种模式**

- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

**IK分词器拓展词条、停用词条**

- 利用config目录的IkAnalyzer.cfg.xml文件添加拓展词典和停用词典
- 在词典中添加拓展词条或者停用词条

## 索引库操作

索引库就类似数据库表，mapping映射就类似表的结构。

我们要向es中存储数据，必须先创建“库”和“表”。

### mapping映射属性

mapping是对索引库中文档的约束

**常见的mapping属性包括：**

- type：字段数据类型
- index：是否创建索引，默认为true
- analyzer：使用哪种分词器
- properties：该字段的子字段

**常见的type简单类型**

- 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、ip地址）
- 数值：long、integer、short、byte、double、float、
- 布尔：boolean
- 日期：date
- 对象：object

### 索引库的CRUD

**创建索引库**

- 请求方式：PUT
- 请求路径：/索引库名，可以自定义
- 请求参数：mapping映射

**查询索引库**

- 请求方式：GET
- 请求路径：/索引库名
- 请求参数：无

**修改索引库**

索引库和mapping一旦创建无法修改，但是可以添加新的字段

```json
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名":{
      "type": "integer"
    }
  }
}
```

**删除索引库**

- 请求方式：DELETE

- 请求路径：/索引库名

- 请求参数：无

## 文档操作

### 创建文档

POST /{索引库名}/_doc/文档id   { json文档 }

### 查询文档

GET /{索引库名}/_doc/文档id

### 删除文档

DELETE /{索引库名}/_doc/文档id

### 修改文档

**全量修改**

PUT /{索引库名}/_doc/文档id { json文档 }

**增量修改**

POST /{索引库名}/_update/文档id { "doc": {字段}}

## RestAPI

ES官方提供了各种不同语言的客户端，用来操作ES。这些客户端的本质就是组装DSL语句，通过http请求发送给ES。官方文档地址：https://www.elastic.co/guide/en/elasticsearch/client/index.html

其中的Java Rest Client又包括两种：

- Java Low Level Rest Client
- Java High Level Rest Client