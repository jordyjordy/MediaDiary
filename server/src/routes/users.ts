import express from 'express'
import db from "../db/index"
var router = express.Router()

// TODO: 
// This method needs to become a POST
router.get('/register', async (req, res) => {
    const client = await db.getClient()
    try {
        await client.query('BEGIN')
        var result = await client.query('INSERT INTO users (email , can_email) VALUES ($1, $2) returning id', [req.query.email, req.query.canemail])
        await client.query('INSERT INTO passwords (user_id, password) VALUES ($1, $2)', [result.rows[0].id, req.query.password])
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


export = router