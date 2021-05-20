const jwt = require('jsonwebtoken')

export = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization
    try {
        if (!token) {
            throw new Error("no valid tokens present")
        } else {
            const secondsSinceEpoch = Math.round(Date.now() / 1000)
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            if (secondsSinceEpoch - decoded.iat >= +process.env.JWT_TIMEOUT!) {
                throw new Error("token expired")
            }
            req.userData = decoded
            next()
        }
    } catch (err) {
        res.status(401).json("Authentication Failed")
    }

}