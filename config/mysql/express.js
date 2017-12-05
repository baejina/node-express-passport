module.exports = function() {
    var express = require('express');
    var session = require('express-session');
    var MYSQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');

    var db = require('../../config/mysql/db');
    var app = express();

    //------------------
    // :: 1. j템플릿엔진을 jade로 하겠다고 설정.
    //------------------
    app.set('views', './views/mysql');
    app.set('view engine', 'jade');
    //------------------

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret: '1234DFs@asd1234!@#$asd',
        resave: false,
        saveUninitialized: true,
        store: new MYSQLStore( {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '111111',
            database: 'o2'
        } )
    }));
    return app;
};
