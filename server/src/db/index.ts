import pkg, { Client, PoolClient } from "pg"
const { Pool } = pkg
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT!)
}
)
interface ClientAction {
    (err: object, client: PoolClient, done: any): void
}

var query = (text: string, params: String[], callback: any) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
        const duration = Date.now() - start
        callback(err, res)
    })
}
var getClient = (callback: ClientAction) => {
    pool.connect((err, client, done) => {
        callback(err, client, done)
    })
}
var db = { query, getClient }
export { db as default }