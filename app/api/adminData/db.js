const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATABASE,
});

async function query(sql, params = []) {
    const [rows] = await pool.promise().query(sql, params);
    return rows;
}

module.exports = { query };
