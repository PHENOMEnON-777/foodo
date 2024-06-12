import mysql from 'mysql2'

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'assolaange777',
    database:'foodoo'
}).promise()

 export { pool };