import bcrypt from 'bcrypt'


export = async (req: any, res: any, next: any) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8)
        next()
    } catch (err) {
        res.status(406).send("no password")
    }

}