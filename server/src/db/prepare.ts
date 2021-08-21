import pkg, { Client, PoolClient } from "pg"
//@ts-ignore
import pgtools from "pgtools"
import { schema } from "./schema"

var prepare = async function () {
    try {
        var res = await pgtools.createdb({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST
        }, process.env.DB_DATABASE)
        createSchema()
    }
    catch (err: any) {
        if (err.name == "duplicate_database") {
            console.log("database already exists, so schema should be correct")
        }
    }
}

var createSchema = async function () {
    const { Pool } = pkg
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT!)
    }
    )
    await pool.query(schema, async (err, res) => {
        if (err === undefined) {
        } else {
            console.log(err)
            console.log("something went wrong creating database, removing it again")
            try {
                await pgtools.dropdb({
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    port: process.env.DB_PORT,
                    host: process.env.DB_HOST
                }, process.env.DB_DATABASE)
                console.log("succesfully removed the database")
            } catch (err) {
                console.log('something went wrong with removing the database')
                console.log(err)
            }


        }
    })
    pool.end()
}

export { prepare }
