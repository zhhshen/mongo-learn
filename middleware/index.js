const path = require('path')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
// 引入koa-static
const staticFiles = require('koa-static')
const mongoose = require('mongoose')
const config = require('../config')
module.exports = (app) => {
    app.use(async (ctx, next) => {
        try {
            await next()
            if (ctx.response.status === 404 && !ctx.response.body) {
                ctx.throw(404)
            }
        } catch (e) {
            let status = parseInt(e.status)
            ctx.status = status
        }
    })
    // 指定 public目录为静态资源目录，用来存放 js css /koa2/images 等
    app.use(staticFiles(path.resolve(__dirname, "../public")))
    app.use(nunjucks({
        ext: 'html',
        path: path.join(__dirname, '../views'), // 指定视图目录
        nunjucksConfig: {
            trimBlocks: true, // 开启转义 防Xss
            noCache: true // 不使用缓存
        },
    }));
    app.use(bodyParser())
    mongoose.Promise = global.Promise
    mongoose.connect(config.database)
    let db = mongoose.connection
    db.on('error', (err) => {
        console.error(err)
    });
    db.once('open', (cb) => {
        console.log(`数据库成功连接`)
    })
}
