const HomeService = require('../service/home')
const { qiniuConfig } = require('../config')

module.exports = {
    home: async(ctx, next) => {
        await ctx.render("home/index", {
            title: "首页"
        })
    },
    todo: async(ctx, next) => {
        await ctx.render("home/todo", {
            title: "todo"
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
    },
    upload: async(ctx, next) => {
        let result = await HomeService.uploadFile(ctx)
        if (result && result.key) {
            // 返回图片地址
            ctx.body = {
                data: {
                    imgUrl: `${qiniuConfig.origin}/${result.key}`
                },
                status: 0,
                message: ''
            }
        }
    },
    file: async(ctx, next) => {
        await ctx.render("home/upload", {
            title: "上传图片"
        })
    }
}
