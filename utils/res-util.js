module.exports = (data = null, show = true, message = '') => {
    let result = {}
    if (!data) {
        result = {
            status: -1,
            message
        }
    }
    if (show) {
        result = {
            message: message,
            data,
            status: 0
        }
    } else {
        result = {
            message: message,
            data: null,
            status: 0
        }
    }
    return result
}
