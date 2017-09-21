module.exports = function() {
    var express = require('express');
    var session = require('express-session');
    var MYSQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');

    //------------------
    // :: 4. db 접속코드를 분리함. passport 설정에 쿼리 날리는 부분때문에 에러남.
    //       해결방법은 주입하거나, 분리해서 require하면 되는데 이경우는 분리함. 해당파일에선 connect를 리턴해
    //------------------
    var db = require('../../config/mysql/db');
    var app = express();

    //------------------
    // :: 1. jade 사용하려면 추가해줘야됨
    //    템플릿엔진을 jade로 하겠다고 설정.
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
}