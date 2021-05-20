import axios from 'axios'

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response && error.response.status == 401) {
            localStorage.removeItem("token")
        }
        return error
    }
)

async function login(user: string, pass: string) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/users/login', { user: user, password: pass })
    return res
}

async function register(user: string, email: string, pass: string, allowemails: boolean, consented: boolean) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/users/register', { user: user, email: email, password: pass, canemail: allowemails, consented: consented })
    return res
}
async function verify() {
    await axios.get(process.env.VUE_APP_SERVER_IP + '/users/verify', { headers: { Authorization: localStorage.getItem("token") } })
}

async function upload(files: any[], date: string) {
    let formData = new FormData()
    for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i])
    }
    formData.append("date", date)
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/log/submit', formData, {
        headers: {
            "Content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token")
        }
    })
    return res
}
async function requestSurvey() {
    var res = await axios.get(process.env.VUE_APP_SERVER_IP + '/surveys/log', { headers: { Authorization: localStorage.getItem("token") } })
    return res.data
}

export default { login, register, verify, upload, requestSurvey }
export { login, register, verify, upload, requestSurvey }