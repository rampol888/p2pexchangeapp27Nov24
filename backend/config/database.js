const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'p2p-exchange.cddjruxsyl3k.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '88Rosetrap88$',
    database: 'p2p_exchange',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool; 