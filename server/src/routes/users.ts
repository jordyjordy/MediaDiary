import express from 'express'
import db from "../db/index"
import { sign, verify } from "jsonwebtoken"
import auth from '../config/auth'
var router = express.Router()

// TODO: 
// This method needs to become a POST
router.post('/register', async (req, res) => {
    const client = await db.getClient()
    try {
        console.log(req.body)
        await client.query('BEGIN')
        var result = await client.query('INSERT INTO users (email , can_email) VALUES ($1, $2) returning id', [req.body.email, req.body.canemail])
        await client.query('INSERT INTO passwords (user_id, password) VALUES ($1, $2)', [result.rows[0].id, req.body.password])
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
    console.log("someone trying to log in")
    const client = await db.getClient();
    try {
        console.log('connected to client')
        await client.query('BEGIN')
        var result = await client.query('SELECT id FROM users WHERE email=$1', [req.body.email])
        var passres = await client.query("SELECT password from passwords where user_id=$1", [result.rows[0].id])
        if (passres.rows[0].password === req.body.password) {
            console.log(result.rows[0].id)
            var token = sign({ _id: result.rows[0].id, "email": req.params.email }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_TIMEOUT })
            res.status(201).json({ token })
        } else {
            res.status(401).send
        }
        client.query("COMMIT")
    } catch (e) {
        client.query("ROLLBACK")
        res.status(401).json("bad credentials")
        console.log("log in failed")
    } finally {
        client.release()
    }
})

router.get('/verify', auth, async (req, res) => {
    res.status(200).send()
})
export = router