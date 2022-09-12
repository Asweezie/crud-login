const jwt = require('jsonwebtoken')
const jwtSecret = 'b46b3aa5b375c91f0a59c2fce60424aa1126a85d2ec34fb06693f06852efa7c79c6529'
exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    message: "Not authorized"
                })
            } else {
                if (decodedToken.role !== 'admin') {
                    return res.status(401).json({
                        message: "Not authorized"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({
            message: 'Not authorized, Token not available.'
        })
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    message: "Not authorized"
                })
            } else {
                if (decodedToken.role !== 'Basic') {
                    return res.status(401).json({
                        message: "Not authorized"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({
            message: 'Not authorized, Token not available.'
        })
    }
}