import express from "express"
import { Client, QueryResult } from "pg"
var app = express()
import db from "./db/index"

app.get('/', (req, res) => {
    console.log("got a request!")
    db.getClient((error, client: any, done) => {
        console.log("got client?")
        client.query('SELECT * FROM users', [], (err: Error, result: any) => {
            if (err) {
                console.log("error!")
                console.log(err)
            }
            res.send(result.rows[0])
        })
    })
})

app.get('/add', (req, res) => {
    console.log("adding user?")
    console.log(req.query)
    db.getClient((error, client, done) => {
        client.query('INSERT INTO users (email , can_email) VALUES ($1, $2)', [req.query.email, req.query.canemail], (err: Error, result: any) => {
            if (err) {
                console.log("error adding user!")
                console.log(err)
                res.send("error!")
            } else {
                res.send("succes!")
            }
        })
    })
})

app.listen('5000')