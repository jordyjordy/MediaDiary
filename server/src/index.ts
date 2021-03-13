import express from "express"
import users from "./routes/users"
var app = express()

app.use('/users', users)

app.listen('5000')