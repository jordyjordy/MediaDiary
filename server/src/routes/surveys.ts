import express from 'express'
import auth from '../config/auth'

import db from "../db/index"
var router = express.Router()

router.get('/log', auth, async (req, res) => {
    const client = await db.getClient();
    try {
        var tempreq: any = req
        // var survey = await client.query('SELECT survey_id FROM userssurveys ORDER BY survey_id LIMIT 1')
        var description = await client.query('SELECT description,start_date,id FROM surveys ORDER BY id ASC LIMIT 1')
        var questions = await client.query('SELECT text FROM questions WHERE survey_id=$1', [description.rows[0].id])
        res.status(200).json({ description: description.rows[0].description, questions: questions.rows, start_date: description.rows[0].start_date })
    } catch (err) {
        console.log(err)
        res.status(500).json()
    }
    client.release()
})

router.post('/create', auth, async (req, res) => {
    var tempreq: any = req
    const client = await db.getClient()
    try {
        await client.query("BEGIN")
        var id = await client.query("INSERT INTO surveys (owner_id, start_date, description,public_key,response_email) VALUES ($1,$2,$3,$4,$5) returning id", [tempreq.userData._id, req.body.start_date, req.body.description, req.body.pub_key, req.body.email])
        for (var i = 0; i < req.body.questions.length; i++) {
            await client.query('INSERT INTO questions (survey_id,text) VALUES ($1,$2)', [id.rows[0].id, req.body.questions[i]])
        }
        await client.query("COMMIT")
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        await client.query("ROLLBACK")
        res.sendStatus(500)
    } finally {
        client.release()
    }
})

export = router