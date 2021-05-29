import express from 'express'
import { UploadedFile } from 'express-fileupload'
import auth from '../config/auth'
import mail from '../util/mail'
import db from "../db/index"


var router = express.Router()

router.post('/submit', auth, async (req, res) => {
    var request: any = req
    let date = req.body.date as string
    let temp = req.files?.file as UploadedFile[]
    const client = await db.getClient()

    try {
        await client.query("BEGIN")
        var survey = await client.query('SELECT * FROM surveys LIMIT 1')
        var result = await mail.sendLog(temp, date, request.userData, survey.rows[0].response_email, survey.rows[0].public_key)
        if (!result!.err) {
            res.status(200).send()
        } else {
            if (result!.err === "no_email") {
                res.status(500).send()
            } else if (result!.err === "no_files") {
                res.status(406).send()
            }
        }
    } catch (err) {

    } finally {
        client.release()
    }

})

export = router