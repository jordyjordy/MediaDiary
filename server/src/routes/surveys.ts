import express from 'express'
import { UploadedFile } from 'express-fileupload'
import auth from '../config/auth'

import db from "../db/index"
var router = express.Router()

router.get('/log', auth, async (req, res) => {
    const client = await db.getClient();
    var tempreq: any = req
    var survey = await client.query('SELECT survey_id FROM userssurveys WHERE user_id=$1', [tempreq.userData._id])
    var description = await client.query('SELECT description,public_key FROM surveys WHERE id=$1', [survey.rows[0].survey_id])
    res.status(200).send(description.rows[0])
    client.release()
})

export = router