const HomeService = require('../service/home')

module.exports = {
    home: async(ctx, next) => {
        await ctx.render("home/index", {
            title: "欢迎你"
        })
    },
    create: async(ctx, next) => {
        let { id, name } = ctx.request.query
        let result = await HomeService.create({ id, name })
        ctx.body = result
    },
    remove: async(ctx, next) => {
        let { id } = ctx.request.query
        let result = await HomeService.remove(id)
        ctx.body = result
    },
    list: async(ctx, next) => {
        let result = await HomeService.getList()
        ctx.body = result
    },
    detail: async(ctx, next) => {
        let { id } = ctx.params
        let result = await HomeService.getDetailById(id)
        await ctx.render("home/detail", result.data)
    }
}
