## WorldCoin行情相关接口文档

### 1.行情列接口

#### 接口地址：
`http://market.xxx.com/procoin-market/quote/marketData.do`

#### 入参 

| 参数类型            | 参数名 | 参数描述                                              |
|-----------------| ------- |---------------------------------------------------|
| String | userId | 用户id                                              |
| String | tab | tab标号：optional首页显示、digital数字货币、spot币币现货、stock股指期货 |
| String | sortField | 排序字段                                              |
| String | sortType | 排序方式 0 正序或传空字符串 1 倒序                              |
| String | page | 分页                                                |

#### 出参
| 参数类型   | 参数名 | 参数描述 |
|--------| ------- | ------- |
| 行情list | quotes | 文件上传后的url list|

#### quotes数据结构
| 参数类型   | 参数名         | 参数描述                        |
|--------|-------------|-----------------------------|
| String | symbol      | 货币符号                        |
| String | name        | 名称                          |
| String | currency    | 货币类型                        |
| String | rate        | 涨跌幅                         |
| String | price       | 当前价格                        |
| String | priceCny    | 当前价转法币                      |
| String | high        | 最高价                         |
| String | highCny     | 最高价转法币                      |
| String | low         | 最低价                         |
| String | lowCny      | 最低价转法币                      |
| String | amount      | 成交数量                        |
| String | balance     | 成交金额                        |
| String | balanceCny  | 成交金额转法币                     |
| String | sortNum     | 排序号                         |
| String | marketType  | digital 数字货币类型 stock 股指期货类型 |
| String | amountSort  | 格式化后的成交数量                   |
| String | balanceSort | 格式化后的成交金额                   |
| String | openMarketStr | 开市状态 格式：已收市，开市中             |

------------------------------------------------------------------
### 2.首页行情接口
#### 接口地址：
`http://market.xxx.com/procoin-market/quote/homePage.do`

#### 入参
无
#### 出参
同marketData.do接口，返回的是首页显示数据

------------------------------------------------------------------
### 3.获取K线接口
#### 接口地址：
`http://market.xxx.com/procoin-market/quote/kline.do`

#### 入参

| 参数类型            | 参数名 | 参数描述                                                                          |
|-----------------| ------- |-------------------------------------------------------------------------------|
| String | symbol | 数字货币唯一符号                                                                      |
| String | timestamp | k线时间戳，传空字符串会默认取当前时间                                                           |
| String | pageSize | 分页大小                                                                          |
| String | klineType | k线类型 min1 1分钟 min5 5分钟 min15 15分钟 hour1 1小时 hour4 4小时 day 日线 week 周线 month 月线 |
| String | type | 横屏时传v，正常默认传空字符串                                                               |

#### 出参
| 参数类型    | 参数名       | 参数描述                                 |
|---------|-----------|--------------------------------------|
| String  | symbol    | 货币符号                                 |
| String  | cxNum     | k线数量                                 |
| String  | klineType | k线类型                                 |
| boolean | isEnd     | true/false 表示完结                      |
| String  | kline     | k线数据，从前到后格式为 秒时间戳,开盘价,最高价,最低价,收盘价,数量 |


