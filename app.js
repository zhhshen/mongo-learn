const Koa = require('koa')
const app = new Koa()
//引用路由
const router = require('./router')
// 引用中间件
const middleware = require('./middleware')
const config = require('./config')
middleware(app)
router(app)
app.listen(config.port, () => {
    console.log(`project is running at http://localhost:${config.port}`)
})
