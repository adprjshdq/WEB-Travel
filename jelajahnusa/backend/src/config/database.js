const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Load .env dari folder backend
dotenv.config({
    path: path.join(__dirname, '../../.env')
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jelajahnusa',
    port: Number(process.env.DB_PORT) || 3306,

    // SSL untuk Aiven
    ssl: process.env.DB_SSL === 'true'
        ? {
            rejectUnauthorized: false
        }
        : undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;