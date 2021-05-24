

var generateToken = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var tokenid = ''
    const charlength = characters.length
    var tokenlength: number = process.env.TOKEN_LENGTH ? +process.env.TOKEN_LENGTH : 25
    for (var i = 0; i < tokenlength; i++) {
        tokenid += characters.charAt(Math.floor(Math.random() * charlength));
    }
    return tokenid
}


export = { generateToken }
