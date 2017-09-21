module.exports = function() {
    var options = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '111111',
        database: 'o2'
    };
    var mysql = require('mysql');
    var conn = mysql.createConnection( options );
    conn.connect();

    return conn;
};

