import nodemailer from 'nodemailer'
const archiver = require('archiver')
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"))

var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendLog = async (files: any, date: Date, userData: any) => {
    var attachments = []
    console.log(files)
    console.log(userData)
    console.log(date.toUTCString())
    console.log('preparing to archive')
    let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: '123' })

    archive.on('warning', (err: any) => {
        console.log('warning')
        console.log(err)
    })
    archive.on('error', (err: any) => {
        console.log('error')
        console.log(err)
    })
    if (!files) {
        console.log("no files attached..")
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
    console.log('appended files to archive')
    var res = await archive.finalize()
    var filename = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "_user-" + userData._id + ".zip"
    attachments.push({ filename: filename, content: archive })
    console.log("archive finalized")
    var emailsubject = "user: " + userData._id + " date: " + date.getDate + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TARGET,
        subject: emailsubject,
        html: `here is the query for user ${userData._id} for ${date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}`,
        attachments: attachments
    }
    try {
        var res = await mail.sendMail(mailOptions)
        console.log('email sent?' + res)
        console.log(res)
        return { res: "success" }
    } catch (err) {
        console.log('could not send email')
        return { err: "no_email" }
    }
}
export = { sendLog }