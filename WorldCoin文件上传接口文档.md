## WorldCoin文件上传接口文档

#### 接口地址：
`http://upload.xxx.com/procoin-file/upload/file.do`

#### 入参 

| 参数类型 | 参数名 | 参数描述 |
| ------- | ------- | ------- |
| String | type | 前端传 file， 通用上传方法 |
| MultipartFile[] | files | 文件 |
|MultipartFile[] | imageFiles | 图片文件（前端统一用files字段，这个字段传空数组）|
|MultipartFile[] | videoFiles | 视频文件（前端统一用files字段，这个字段传空数组）|
|String | dir | 默认传common|
|String | verify | 校验字符串，上传时如果传入，返回时会把该参数返回|

#### 出参
| 参数类型 | 参数名 | 参数描述 |
| ------- | ------- | ------- |
|字符串list | fileUrlList | 文件上传后的url list|
|String | verify | 校验字符串，上传时如果传入，返回时会把该参数返回|
