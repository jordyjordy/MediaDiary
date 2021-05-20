import express from 'express'
import db from "../db/index"
import { sign } from "jsonwebtoken"
import auth from '../config/auth'
import bcrypt from 'bcrypt'
import encrypt from '../config/encrypt'
var router = express.Router()

// TODO: 
// This method needs to become a POST
router.post('/register', encrypt, async (req, res) => {
    const client = await db.getClient()
    try {
        await client.query('BEGIN')
        var result = await client.query('INSERT INTO users (username, email, can_email, consented) VALUES ($1, $2, $3, $4) returning id', [req.body.user, req.body.email, req.body.canemail, req.body.consented])
        await client.query('INSERT INTO passwords (user_id, password) VALUES ($1, $2)', [result.rows[0].id, req.body.password])
        var surveyid = await client.query('SELECT id FROM surveys ORDER BY id LIMIT 1')
        await client.query('INSERT INTO userssurveys (user_id,survey_id) VALUES ($1,$2)', [result.rows[0].id, surveyid.rows[0].id])
        await client.query('COMMIT')
        res.send('succes')
    } catch (e) {
        await client.query('ROLLBACK')
        if (e instanceof Error) {
            if (e.message.match(/^duplicate key value violates unique constraint "unique_email"/i)) {
                res.send("email already in use")
            } else {
                console.log(e)
                res.send("an error occured")
            }
        } else {
            res.send("an error occured")
        }
    }
    finally {
        client.release()
    }
})

router.post('/login', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN')
        var result = await client.query('SELECT id FROM users WHERE username=$1', [req.body.user])
        var passres = await client.query("SELECT password from passwords where user_id=$1", [result.rows[0].id])
        if (await bcrypt.compare(req.body.password, passres.rows[0].password)) {
            var token = sign({ _id: result.rows[0].id, "email": req.params.email }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_TIMEOUT })
            res.status(201).json({ token })
        } else {
            res.status(401).send
        }
        client.query("COMMIT")
    } catch (e) {
        client.query("ROLLBACK")
        res.status(401).json("bad credentials")
    } finally {
        client.release()
    }
})

router.get('/verify', auth, async (req, res) => {
    res.status(200).send()
})

export = router