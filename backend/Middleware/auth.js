import jwt from 'jsonwebtoken'
import config from '../config/index.js'

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({ message: "FATAL ERROR - no token provided!" })

    try {
        const decoded = jwt.verify(token, config.jwtSecret)
        req.user = decoded
        next()
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Invalid token!' })
    }
}

export default auth