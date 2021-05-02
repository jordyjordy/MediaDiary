import express from "express"
import users from "./routes/users"
import cors from "cors"

var app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/users', users)

var port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 5000
app.listen(port)
console.log("server listening on port " + port)