let sqlite3 = require('sqlite3')

new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == 'SQLITE_CANTOPEN') {
        createDatabase()
        return
    } else if (err) {
        console.log(`we have an error in our database creation/opening: ${err}`)
        exit(1)
    }
    //runQueries(db)
})

const createDatabase = () => {
    let newdb = new sqlite3.Database('database.db', err => {
        if (err) {
            console.log(`error in creating db: ${err}`)
            exit(1)
        }
        createTables(newdb)
    })
}

const createTables = (newdb) => {
    newdb.exec(`
        create table students (
            student_id int primary key not null,
            student_name text not null,
            student_address text,
        );
        insert into students (student_id, student_name, student_address)
            values  (1, 'christian', 'abc123'),
                    (2, 'amy', 'ab134'),
    `)
}

const runQueries = (db) => {
    let sql = `SELECT student_id FROM students`
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }
        rows.array.forEach(row => {
            console.log(row)
        });
    })
}
