import express from 'express'
import { UploadedFile } from 'express-fileupload'
import auth from '../config/auth'
import mail from '../util/mail'
var router = express.Router()

router.post('/submit', auth, async (req, res) => {
    var request: any = req
    //console.log(req)
    let date = req.body.date as string
    console.log(date)
    console.log(new Date(date))
    let temp = req.files?.file as UploadedFile[]
    var result = await mail.sendLog(temp, new Date(date), request.userData)
    if (!result.err) {
        res.status(200).send()
    } else {
        if (result.err === "no_email") {
            res.status(500).send()
        } else if (result.err === "no_files") {
            res.status(406).send()
        }
    }

})

export = router