const fs = require('fs')
const path = require('path')
module.exports = {
    /**
     * 移除文件
     */
    removeFile: async (path) => {
        fs.unlink(path, (err) => {
            if (err) {
                throw err
            }
            console.log('文件删除成功！')
        })
    },
    /**
     * 写入目录
     */
    mkdirsSync (dirname) {
        if (fs.existsSync(dirname)) {
            return true
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname)
                return true
            }
        }
        return false
    }
}
