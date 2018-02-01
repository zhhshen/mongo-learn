const router = require('koa-router')()

const HomeController = require('../controllers/home')

module.exports = (app) => {
    router.get('/', HomeController.home)
    router.get('/todo', HomeController.todo)
    router.get('/detail/:id', HomeController.detail)
    router.get('/file', HomeController.file)
    router.get('/api/list', HomeController.list)
    router.get('/api/list/add', HomeController.create)
    router.get('/api/list/remove', HomeController.remove)
    router.post('/api/upload', HomeController.upload)
    app.use(router.routes()).use(router.allowedMethods())
}
