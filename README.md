### koa2框架
---

本项目主要是对koa2的练手项目，结合koa常用的中间件，node上传图片到七牛服务器，数据存储mongo等等

项目中引入的config.js文件内容如下

```javascript
const config = {
    port: 3001,
    database: `mongodb://localhost:27017/你的mongo数据库名',
    qiniuConfig: {
        accessKey: '你的七牛accessKey',
        secretKey: '你的七牛secretKey',
        bucket: '你的七牛存储空间名字',
        origin: ''
    }
}
module.exports = config

```

#### 参考资料
* [https://github.com/naihe138/koa-upload](https://github.com/naihe138/koa-upload)
* [https://chenshenhai.github.io/koa2-note/](https://chenshenhai.github.io/koa2-note/)
* [七牛node.js sdk](https://developer.qiniu.com/kodo/sdk/3828/node-js-v6#2)
