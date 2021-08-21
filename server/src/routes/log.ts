import express from 'express'
import { UploadedFile } from 'express-fileupload'
import auth from '../config/auth'
import { sendLog } from '../util/mail'
import db from "../db/index"


var router = express.Router()

router.post('/submit', auth, async (req, res) => {
    var request: any = req
    let date = req.body.date as string
    let temp = req.files?.file as UploadedFile[]
    const client = await db.getClient()

    try {
        await client.query("BEGIN")
        await client.query('SET datestyle = dmy;')
        var survey = await client.query('SELECT * FROM surveys ORDER BY id ASC LIMIT 1')
        await client.query('INSERT INTO answers (user_id,survey_id,path,answer_date) VALUES ($1,$2,$3,$4)', [request.userData._id, survey.rows[0].id, "-", date])
        var answers = await client.query('SELECT COUNT(*) FROM answers WHERE user_id = $1 AND survey_id = $2 AND answer_date = $3', [request.userData._id, survey.rows[0].id, date])
        var result = await sendLog(temp, date, request.userData, survey.rows[0].response_email, survey.rows[0].public_key, answers.rows[0].count)
        if (!result!.err) {
            res.status(200).send()
            await client.query("COMMIT")
        } else {
            await client.query("ROLLBACK")
            if (result!.err === "no_email") {
                res.status(500).send()
            } else if (result!.err === "no_files") {
                res.status(406).send()
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
    }

})

export = router