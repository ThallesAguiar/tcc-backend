const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const authConfig = require('../../config/auth')

module.exports =  async(req, res, next ) => {

    const authHeader = req.headers.authorization;

    // console.log(authHeader);

    if(!authHeader) {
        return res.status(401).json({error: 'Token not provided'})
    }

    const [, token] = authHeader.split(' ')

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.AUTH_SECRET)
        // console.log(decoded)
        req.userId = decoded._id
        return next()

    } catch (err) {
        return res.status(401).json({error: 'Token invalid'})
    }
}