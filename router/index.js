const router = require('koa-router')()

const HomeController = require('../controllers/home')

module.exports = (app) => {
    router.get('/', HomeController.home)
    router.get('/api/list', HomeController.list)
    router.get('/api/list/add', HomeController.create)
    router.get('/api/list/remove', HomeController.remove)
    router.get('/detail/:id', HomeController.detail)
    app.use(router.routes()).use(router.allowedMethods())
}
