import mysql from 'mysql2'

const pool=mysql.createPool({
    host: 'roundhouse.proxy.rlwy.net',
    user: 'root',
    password:'GipINKTopqxvbHmixQOalqbMMjuYLzLw',
    database:'railway',
    port:54451
}).promise()

 export { pool };