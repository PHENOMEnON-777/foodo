import mysql from 'mysql2'

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'12345',
    database:'foodoo'
}).promise()

 export { pool };