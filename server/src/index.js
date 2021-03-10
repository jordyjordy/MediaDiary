var express = require('express')
var app = express()

app.get('/', (req, res) => {
    console.log("got a request!")
    res.send("tadaa")
})

app.listen('5000')