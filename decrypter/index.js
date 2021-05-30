
const fs = require('fs');
const NodeRSA = require('node-rsa');
const readline = require('readline');
var chilkat = require('@chilkat/ck-node14-win64');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans)
    }))
}

module.exports = async function () {
    const keyname = await askQuestion("What is the new of your private RSA key file in this folder?\n")
    const privatekey = fs.readFileSync(keyname, 'utf8')
    const key = new NodeRSA()
    var directory = process.cwd()
    key.importKey(privatekey, 'openssh-private')
    var files = fs.readdirSync('./')
    let re = /.zip$/
    var zip = new chilkat.Zip()
    files.forEach((file) => {
        if (file.match(re)) {
            var directoryname = file.split("_")[0]
            var name = file.slice(0, -4)
            let encrypted = fs.readFileSync(directory + '/' + name + ".txt", 'utf8')
            let pass = key.decrypt(encrypted, 'utf-8')
            if (!fs.existsSync(directory + '/' + directoryname)) {
                fs.mkdirSync(directory + '/' + directoryname)
            }
            zip.OpenZip(file)
            zip.DecryptPassword = pass
            zip.Unzip(directory + '/' + directoryname)
        }
    })
}
