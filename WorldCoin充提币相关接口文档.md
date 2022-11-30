## WorldCoin充提币相关接口文档

### 1.获取币种及链类型列表

#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/coinList.do`

#### 入参 

| 参数类型 | 参数名    | 参数描述                                              |
|------|--------|---------------------------------------------------|
| long | userId | 用户id                                              |
| int  | inOut  | 充提币类型，充币 1 ，提币 -1 |

#### 出参
| 参数类型    | 参数名           | 参数描述              |
|---------|---------------|-------------------|
| 字符串list | coinList      | 币种list            |
| 字符串list | chainTypeList | 链类型list（仅供USDT使用） |

------------------------------------------------------------------
### 2.获取充币基础信息
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/getChargeConfigs.do`

#### 入参
| 参数类型   | 参数名    | 参数描述 |
|--------|--------|------|
| long   | userId | 用户id |
| String | symbol | 币种符号 |
#### 出参
| 参数类型       | 参数名           | 参数描述     |
|------------|---------------|----------|
| BigDecimal | availableAmount      | 可用余额     |
| BigDecimal | minChargeAmount | 最小充值金额   |
| 充币地址list   | addressList | 充币地址list |
#### 充币地址参数
| 参数类型       | 参数名           | 参数描述 |
|------------|---------------|------|
| String | symbol      | 币种符号 |
| String | address | 充币地址 |
| String     | qrcode | 二维码  |
| String     | chainType | 链类型  |

------------------------------------------------------------------
### 3.获取提币基础信息
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/getWithdrawConfigs.do`

#### 入参
| 参数类型   | 参数名    | 参数描述 |
|--------|--------|------|
| long   | userId | 用户id |
| String | symbol | 币种符号 |
#### 出参
| 参数类型       | 参数名             | 参数描述     |
|------------|-----------------|----------|
| BigDecimal | availableAmount | 可用余额     |
| BigDecimal | frozenAmount    | 冻结金额     |
| BigDecimal | fee             | 提币手续费    |
| 提币地址list   | addressList | 提币地址list |
#### 提币地址参数
| 参数类型   | 参数名        | 参数描述         |
|--------|------------|--------------|
| Long   | id         | 提币地址id       |
| Long   | userId     | 用户id         |
| String | symbol     | 币种符号         |
| String | address    | 提币地址         |
| String | chainType  | 链类型（仅USDT使用） |
| String | remark     | 备注           |
| Long   | createTime | 创建时间戳        |
------------------------------------------------------------------
### 4.提交提币申请
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/withdrawSubmit.do`

#### 入参
| 参数类型       | 参数名       | 参数描述 |
|------------|-----------|------|
| Long       | userId    | 用户id |
| BigDecimal | amount    | 提币数量 |
| Long       | addressId | 地址id |
------------------------------------------------------------------
### 5.提交充币申请
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/chargeSubmit.do`

#### 入参
| 参数类型       | 参数名       | 参数描述                |
|------------|-----------|---------------------|
| Long       | userId    | 用户id                |
| String     | symbol    | 币种符号                |
| BigDecimal | amount    | 提币数量                |
| String     | address   | 充币地址                |
| String     | image     | 充币截图                |
| String     | chainType | 链类型（symbol为USDT时传入） |
------------------------------------------------------------------
### 6.撤销申请
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/cancel.do`

#### 入参
| 参数类型       | 参数名    | 参数描述    |
|------------|--------|---------|
| Long       | userId | 用户id    |
| Long       | dwId   | 充提币申请id |
------------------------------------------------------------------
### 7.获取提币充币/申购相关记录
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/list.do`

#### 入参
| 参数类型   | 参数名    | 参数描述                 |
|--------|--------|----------------------|
| int    | type   | 默认1 充提币记录 2 获取申购相关记录 |
| Long   | userId | 用户id                 |
| String | inOut  | 充提币类型，充币 1 ，提币 -1    |
| int    | pageNo | 页码 默认1               |
| String | platform | 平台类型                 |
#### 出参
| 参数类型       | 参数名    | 参数描述                                                  |
|------------|--------|-------------------------------------------------------|
| BigDecimal | dwId   | 可用余额                                                  |
| BigDecimal | userId | 冻结金额                                                  |
| BigDecimal | symbol | 提币手续费                                                 |
| BigDecimal | amount | 充提币提交金额                                               |
| BigDecimal | fee    | 充提币手续费                                                |
| BigDecimal | realAmount | 真实充提币金额                                               |
| String     | address | 充提币地址                                                 |
| String     | chainType | 键类型                                                   |
| int        | state | 0=已提交(提币时才有撤销按钮，其他状态没有撤销),1=已受理,2=已成功,-1=已撤销,-2=未通过审核 |
| String     | stateDesc | 提币状态描述                                                |
| int        | inOut | 1：充币，-1：提币 2 申购冻结 3 申购成功转换 4 申购失败退回                   |
| long       | createTime | 创建时间（废弃）                                              |
| String     | type | 类型（申购用）                                               |
| long       | time | 创建时间                                                  |
| long       | transferTime | 解仓时间（申购用）                                             |
| String     | subSymbol | 申购的币种符号                                               |
| String   | subTitle | 申购标题                                                  |
| long       | sessionId | 申购场次id                                                |
------------------------------------------------------------------
### 8.获取提币地址列表
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/addressList.do`

#### 入参
| 参数类型       | 参数名       | 参数描述                    |
|------------|-----------|-------------------------|
| Long       | userId    | 用户id                    |
| String     | symbol    | 非必填，币种符号                |
| String     | chainType | 非必填，链类型（symbol为USDT时传入） |

#### 出参
| 参数类型   | 参数名        | 参数描述         |
|--------|------------|--------------|
| Long   | id         | 提币地址id       |
| Long   | userId     | 用户id         |
| String | symbol     | 币种符号         |
| String | address    | 提币地址         |
| String | chainType  | 链类型（仅USDT使用） |
| String | remark     | 备注           |
| Long   | createTime | 创建时间戳        |
------------------------------------------------------------------
### 9.删除提币地址
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/delAddress.do`

#### 入参
| 参数类型       | 参数名       | 参数描述                    |
|------------|-----------|-------------------------|
| Long       | addressId | 提币地址id                  |
------------------------------------------------------------------
### 10.添加提币地址
#### 接口地址：
`http://api.xxx.com/procoin/depositeWithdraw/addAddress.do`

#### 入参
| 参数类型       | 参数名       | 参数描述              |
|------------|-----------|-------------------|
| Long       | userId    | 用户id              |
| Long       | address   | 提币地址              |
| Long       | remark | 备注                |
| Long       | symbol | 币种唯一符号            |
| Long       | chainType | 链类型（symbol为usdt时传入） |