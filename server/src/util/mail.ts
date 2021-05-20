import NodeRSA from 'node-rsa'
import nodemailer from 'nodemailer'
import token from '../config/token'
const archiver = require('archiver')
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"))

var mail = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


const sendLog = async (files: any, date: string, userData: any, targetemail: string, public_key: string) => {
    var attachments = []
    var pass = await token.generateToken()
    let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: pass })
    var key = new NodeRSA()
    key.importKey(public_key, 'openssh-public')
    var encryptedpass = key.encrypt(pass, 'base64')
    archive.on('warning', (err: any) => {
        console.log('warning')
        console.log(err)
    })
    archive.on('error', (err: any) => {
        console.log('error')
        console.log(err)
    })
    if (!files) {
        return { err: "no_files" }
    }
    else if (!files.length) {
        archive.append(files.data, { name: files.name })
    }
    else {
        for (var i = 0; i < files.length; i++) {
            archive.append(files[i].data, { name: files[i].name })
        }
    }
    var res = await archive.finalize()
    var tokenname = date + "_user-" + userData._id + ".txt"
    attachments.push({ filename: tokenname, content: encryptedpass })
    var filename = date + "_user-" + userData._id + ".zip"
    attachments.push({ filename: filename, content: archive })
    var emailsubject = "user: " + userData._id + " date: " + date
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: targetemail,
        subject: emailsubject,
        html: `here is the query for user ${userData._id} for ${date}`,
        attachments: attachments
    }
    try {
        var res = await mail.sendMail(mailOptions)
        return { res: "success" }
    } catch (err) {
        console.log('could not send email')
        console.log(err)
        return { err: "no_email" }
    }
}
export = { sendLog }