const errorHandler = require('./errorHandler')

module.exports = {
    restrict: (req, res, next) => {
        const clientIp = req.ip.replace('::ffff:', '') || req.connection.remoteAddress.replace('::ffff:', '');

        const localIps = ['127.0.0.1', '::1'];

        if (localIps.includes(clientIp)) {
            return next()
        }

        if (clientIp.startsWith('192.168.') || clientIp.startsWith('10.') || (clientIp.startsWith('172.') && parseInt(clientIp.split('.')[1], 10) >= 16 && parseInt(clientIp.split('.')[1], 10) <= 31)) {
            return next()
        }

        next(errorHandler.createError(403,  "You do not have permission to access this resource."))
    }
}