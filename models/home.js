const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 定义表结构
const homeSchema = new Schema({
    name: String,
    createTime: {
        type: Date,
        default: Date.now()
    },
    updateTime: {
        type: Date,
        default: Date.now()
    },
})
// 参数User 据库中的集合名称, 不存在会创建.
const Home = mongoose.model('Home', homeSchema)

module.exports = Home
