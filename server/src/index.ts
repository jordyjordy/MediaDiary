import express from "express"
import users from "./routes/users"
import log from "./routes/log"
import surveys from "./routes/surveys"
import cors from "cors"
import fileUpload from 'express-fileupload'

var app = express()
app.use(fileUpload({ createParentPath: true }))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/users', users)
app.use('/log', log)
app.use('/surveys', surveys)
var port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 5000
app.listen(port, () => {
    console.log("server listening on port " + port)
})
