import express from 'express'
import { UploadedFile } from 'express-fileupload'
import auth from '../config/auth'

import db from "../db/index"
var router = express.Router()

router.get('/log', auth, async (req, res) => {
    const client = await db.getClient();
    var description = await client.query('SELECT description,public_key FROM surveys LIMIT 1')
    res.status(200).send(description.rows[0])
})

export = router