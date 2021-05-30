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

const sendEmail = async function (attachments: object[], emailsubject: string, targetemail: string, html: string) {
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: targetemail,
        subject: emailsubject,
        html: html,
        attachments: attachments
    }
    try {
        var res = await mail.sendMail(mailOptions)
        return { res: "success" }
    } catch (err) {
        console.log(err)
        return { err: "no_email" }
    }

}

const sendLog = async (files: any, date: string, userData: any, targetemail: string, public_key: string, counter: number) => {
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

    let archived = false;
    if (!files.length) {
        archive.append(files.data, { name: counter + '/' + files.name })
        archived = true
    } else {
        let sum = 0;
        files.forEach((element: any) => {
            sum += element.data.length
        })
        if (sum <= 2084009) {
            console
            for (var i = 0; i < files.length; i++) {
                archive.append(files[i].data, { name: counter + '/' + files[i].name })
            }
            archived = true
        }
    }
    if (archived) {
        var res = await archive.finalize()
        var attachments = []
        var tokenname = date + "_user-" + userData._id + "_" + counter + ".txt"
        attachments.push({ filename: tokenname, content: encryptedpass })
        var filename = date + "_user-" + userData._id + "_" + counter + ".zip"
        attachments.push({ filename: filename, content: archive })
        var emailsubject = "user: " + userData._id + " date: " + date
        var html = `here is the query for user ${userData._id} for ${date}`
        return await sendEmail(attachments, emailsubject, targetemail, html)
    } else {
        var attachments = []
        let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: pass })
        var datacount = 0
        var archivecount = 0
        for (var i = 0; i < files.length; i++) {
            if (datacount + files[i].data.length >= 2084009) {
                var res = await archive.finalize()
                var tokenname = date + "_user-" + userData._id + "-" + (archivecount + 1) + "_" + counter + ".txt"
                var filename = date + "_user-" + userData._id + "-" + (archivecount + 1) + "_" + counter + ".zip"
                attachments.push({ filename: tokenname, content: encryptedpass })
                attachments.push({ filename: filename, content: archive })
                archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: pass })
                datacount = 0
                archivecount++
            }
            archive.append(files[i].data, { name: counter + '/' + files[i].name })
            datacount += files[i].data.length
        }
        var res = await archive.finalize()
        var tokenname = date + "_user-" + userData._id + "-" + (archivecount + 1) + ".txt"
        var filename = date + "_user-" + userData._id + "-" + (archivecount + 1) + ".zip"
        attachments.push({ filename: tokenname, content: encryptedpass })
        attachments.push({ filename: filename, content: archive })
        var emailsubject = "user: " + userData._id + " date: " + date
        var html = `here is the query for user ${userData._id} for ${date}`
        return await sendEmail(attachments, emailsubject, targetemail, html)
    }
}

export = { sendLog }