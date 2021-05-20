import axios from 'axios'

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response.status == 401) {
            localStorage.removeItem("token")
        }
        return error
    }
)

async function login(email: string, pass: string) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/users/login', { email: email, password: pass })
    return res
}

async function register(email: string, pass: string) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/users/register', { email: email, password: pass, canemail: false })
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
    console.log(files.length)
    formData.append("date", date)
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/log/submit', formData, {
        headers: {
            "Content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token")
        }
    })
}
async function requestSurvey() {
    var res = await axios.get(process.env.VUE_APP_SERVER_IP + '/surveys/log', { headers: { Authorization: localStorage.getItem("token") } })
    return res.data
}

export default { login, register, verify, upload, requestSurvey }
export { login, register, verify, upload, requestSurvey }