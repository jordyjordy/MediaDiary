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
    var res = await axios.get(process.env.VUE_APP_SERVER_IP + '/users/verify', { headers: { Authorization: localStorage.getItem("token") } })
}

export default { login, register, verify }
export { login, register, verify }