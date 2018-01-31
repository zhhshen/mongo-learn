const moment = require('moment')
const HomeModel = require('../models/home')
const ResUtil = require('../utils/res-util')
const datetime = require('../utils/datetime')

let add = async (info) => {
    return new Promise((resolve, reject) => {
        HomeModel.findOne({name: info.name}).exec((err, data) => {
            if (err) {
                reject(err)
            } else if (!data) {
                HomeModel.create({
                    name: info.name,
                    createTime: moment(),
                    updateTime: moment()
                }, (err, newData) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(newData)
                    }
                })
            } else {
                resolve(data)
            }
        })

    })
}

let fetch = async () => {
    return new Promise((resolve, reject) => {
        HomeModel.find({}, { name: 1, createTime: 1 }).sort({ createTime: -1 }).exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                let result = []
                let formatType = 'YYYY-MM-DD hh:mm'
                data.forEach((d) => {
                    let stamp = new Date(d.createTime).getTime()
                    let time = datetime.parseStampToFormat(stamp, formatType)
                    result.push({
                        name: d.name,
                        createTime: time,
                        _id: d._id
                    })
                })
                resolve(result)
            }
        })
    })
}

let remove = async (id) => {
    return new Promise((resolve, reject) => {
        HomeModel.remove({ _id: id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

let findById = async (id) => {
    return new Promise((resolve, reject) => {
        HomeModel.findOne({_id: id}).exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                let result = {}
                let formatType = 'YYYY-MM-DD hh:mm'
                let stamp = new Date(data.createTime).getTime()
                let time = datetime.parseStampToFormat(stamp, formatType)
                result = {
                    name: data.name,
                    createTime: time
                }
                resolve(result)
            }
        })
    })
}

module.exports = {
    /**
     * 添加一条记录
     * @type {[type]}
     */
    create: async (info) => {
        let data = await add(info)
        if (data) {
            return ResUtil(null, false, 'it is good😆')
        } else {
            return ResUtil(null, false, 'it is too bad☹️')
        }
    },

    getList: async () => {
        let data = await fetch()
        if (data) {
            return ResUtil(data)
        } else {
            return ResUtil(null, false, 'it is too bad☹️')
        }
    },
    /**
     * 通过id移除列表数据
     */
    remove: async (id) => {
        let data = await remove(id)
        if (data) {
            return ResUtil(null, false, 'it is good😆')
        } else {
            return ResUtil(null, false, 'it is too bad☹️')
        }
    },
    /**
     * 通过id获取详情信息
     */
    getDetailById: async(id) => {
        let data = await findById(id)
        if (data) {
            return ResUtil(data)
        } else {
            return ResUtil(null, false, 'it is too bad☹️')
        }
    }
}
