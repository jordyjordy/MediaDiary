import express from 'express'
import db from "../db/index"
import { sign } from "jsonwebtoken"
import auth from '../config/auth'
var router = express.Router()


router.post('/submit', auth, async (req, res) => {

})