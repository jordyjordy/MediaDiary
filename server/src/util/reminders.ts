import db from "../db/index"
import { sendReminders as emailReminders } from "../util/mail"

export const sendReminders = async () => {
    const client = await db.getClient();
    var date = new Date()
    var datetext = date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear();
    console.log(datetext)
    await client.query('SET datestyle = dmy;')
    const emails = await client.query('select email from users where can_email = true AND id NOT IN (select user_id from answers where answer_date = $1)', [datetext])
    await emailReminders(emails.rows)
    client.release()
}
