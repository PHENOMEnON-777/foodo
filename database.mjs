import mysql from 'mysql2'

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'Mireille@23',
    database:'foodoo'
}).promise()

 export { pool };