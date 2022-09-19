require('dotenv').config({
    'path' : __dirname + '/.env'
})
const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()
const PORT = process.env.PORT || 3000
const token = process.env.BOT_TOKEN

const eventsApi = require('@slack/events-api')
const slackEvents = eventsApi.createEventAdapter(process.env.SIGNING_SECRET)
const { WebClient, LogLevel } = require('@slack/web-api')
const client = new WebClient(token, {
    logLevel : LogLevel.DEBUG
});

app.use('/', slackEvents.expressMiddleware())

slackEvents.on('message', async(event) => {
    console.log(event)
    if(!event.subtype && !event.bot_id)
    client.chat.postMessage({
        token, 
        channel: event.channel, 
        thread_ts: event.ts, 
        text: event.text,
        user: event.user
    })

    // add the student to our db
    addStudent(event.user)
})



// our db
let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == 'SQLITE_CANTOPEN') {
        createDatabase()
        return
    } else if (err) {
        console.log(`we have an error in our database creation/opening: ${err}`)
        exit(1)
    }
    console.log('we have a db already')  
})

const createDatabase = () => {
    console.log('creating a db...')
    let newdb = new sqlite3.Database('database.db', err => {
        if (err) {
            console.log(`error in creating db: ${err}`)
            exit(1)
        }
        
    })
}

// find a student

const findStudent = (name) => {
    const sql = `
        INSERT INTO students(name) VALUES(?)
        SELECT DISTINCT 
    `

    const params = [name]

    db.run(sql, params, (err) => {
        if (err) {
            console.log('find student: ', err)
        }
    })
}

// insert a new student into our users table
const addStudent = (name) => {
    console.log('adding a student')
    let sql = `INSERT INTO students(name) VALUES(?)`
    let params = [name]
    db.run(sql, params, (err) => {
        if (err) {
            console.log(`we have an error when adding a student : ${err}`)
        }
    })
}

// run our server
app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`)
})