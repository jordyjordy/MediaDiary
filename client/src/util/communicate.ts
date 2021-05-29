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
    console.log(`uploading ${files.length} files`)
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
async function requestEmailPref() {
    var res = await axios.get(process.env.VUE_APP_SERVER_IP + "/users/emailpreferences", { headers: { Authorization: localStorage.getItem("token") } })
    return res.data
}

async function updateEmailPref(can_email: boolean) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + "/users/updateprofile", { canemail: can_email }, { headers: { Authorization: localStorage.getItem("token") } })
    return res.data
}

async function requestSurvey() {
    var res = await axios.get(process.env.VUE_APP_SERVER_IP + '/surveys/log', { headers: { Authorization: localStorage.getItem("token") } })
    return res.data
}

async function submitSurvey(name: string, description: string, email: string, pub_key: string, questions: string[], start_date: string) {
    var res = await axios.post(process.env.VUE_APP_SERVER_IP + '/surveys/create', { name: name, description: description, email: email, pub_key: pub_key, questions: questions, start_date: start_date }, { headers: { Authorization: localStorage.getItem("token") } })
}

export default { login, register, verify, upload, requestSurvey, requestEmailPref, updateEmailPref, submitSurvey }
export { login, register, verify, upload, requestSurvey, requestEmailPref, updateEmailPref, submitSurvey }