const moment = require('moment')
const path = require('path')
const fs = require('fs')
const qiniu = require('qiniu')
const HomeModel = require('../models/home')
const datetime = require('../utils/datetime')
const ResUtil = require('../utils/res-util')
const fsUtil = require('../utils/fs-util')
const { qiniuConfig } = require('../config')
const Busboy = require('busboy')

const add = (info) => {
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

const fetch = () => {
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

const remove = (id) => {
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

const findById = (id) => {
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

const getSuffix = (fileName) => {
  return fileName.split('.').pop()
}

// 重命名
const Rename = (fileName) => {
  return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName)
}
/**
 * 上传到本地
 */
const uploadLocal = (ctx, options) => {
    const _emmiter = new Busboy({headers: ctx.req.headers})
    const fileType = options.fileType
    const filePath = path.join(options.path, fileType)
    const confirm = fsUtil.mkdirsSync(filePath)
    if (!confirm) return
    console.log('start uploading...')
    return new Promise((resolve, reject) => {
        _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const fileName = Rename(filename)
            const saveTo = path.join(path.join(filePath, fileName))
            file.pipe(fs.createWriteStream(saveTo))
            file.on('end', function () {
                resolve({
                  imgPath: `/${fileType}/${fileName}`,
                  imgKey: fileName
                })
            })
        })

        _emmiter.on('finish', function () {
            console.log('finished...')
        })

        _emmiter.on('error', function (err) {
            console.log('err...')
            reject(err)
        })
        ctx.req.pipe(_emmiter)
    })
}
/**
 * 上传到七牛
 */
const uploadToQiniu = (filePath, key) => {
    const { accessKey, secretKey, bucket } = qiniuConfig
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
        scope: bucket
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(mac)

    const config = new qiniu.conf.Config()
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0
    const localFile = filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    // 文件上传
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                reject(respErr)
            }
            if (respInfo.statusCode == 200) {
                resolve(respBody)
            } else {
                resolve(respBody)
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
    },

    uploadFile: async (ctx) => {
        const serverPath = path.join(__dirname, '../public/files')
        let opts = {
            fileType: 'images',
            path: serverPath
        }
        // 上传到本地服务器
        let result = await uploadLocal(ctx, opts)
        const imgPath = path.join(serverPath, result.imgPath)
        // 上传到七牛
        const qiniuResult = await uploadToQiniu(imgPath, result.imgKey)
        // 上存到七牛之后 删除原来的缓存图片
        await fsUtil.removeFile(imgPath)
        return qiniuResult
    }
}
