// mysql 설치
//
// CREATE TABLE users (
//     id INT NOT NULL AUTO_INCREMENT ,
//     authId VARCHAR(50) NOT NULL ,
//     username VARCHAR(30),
//     password VARCHAR(255),
//     salt VARCHAR(255),
//     displayName VARCHAR(50),
//     PRIMARY KEY (id),
//     UNIQUE (authId)
// ) ENGINE = InnoDB;

// facebook federation profile 사용하려고 email 컬럼 추가
// 쿼리추가
// alter table users add email varchar(50);

var express = require('express');
var session = require('express-session');

//var FileStore = require('session-file-store')(session);
var MYSQLStore = require('express-mysql-session')(session);

var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//-------------------------
// :: facebook login
//-------------------------
// var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '111111',
    database: 'o2'
}
var mysql = require('mysql');
var conn = mysql.createConnection( options );
conn.connect();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: '1234DFs@asd1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store: new MYSQLStore( options )
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/register', function(req, res) {
    hasher( {password: req.body.password }, function(err,pass,salt,hash) {
        var user = {
            authId: 'local:'+ req.body.username,
            userName: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.nickname
        };

        var sql = 'Insert into users set ?';
        conn.query(sql, user, function(err, results) {
            if(err) {
                console.log("error:", err);
                res.status(500);
            } else {
                req.login(user, function(err) {
                    req.session.save(function() {
                        res.redirect("/welcome");
                    });
                });
            }
        });

    });
});


app.get('/auth/register', function(req, res) {
    var output = `
        <h1>Register</h1>
        <form action="/auth/register" method="post">
            <p>
                <input type="text" name="username"
                placeholder="username">

            </p>
            <p>
                <input type="password" name="password"
                placeholder="password">
            </p>
            <p>
                <input type="text" name="nickname"
                placeholder="nickname">
            </p>
            <p>
                <input type="submit" value="확인">
            </p>
        </form>
    `;
    res.send(output);
    console.log("Register");
});

app.get('/welcome', function(req, res){
    if(req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `);
    }
});

// LocalStrategy done(null, user);
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
    var sql = 'Select * from users where authId=?';
    conn.query(sql, [id], function(err, results) {
        if(err) {
            console.log(err);
            done('There is no user', false);
        } else {
            console.log(results[0]);
            done(null, results[0]);
        }
    });
});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;

        var sql = 'Select * from users where authId= ?'
        conn.query(sql, ['local:'+uname], function(err, results) {
            if(err) {
                return done('There is no user');
            }

            var user = results[0];
            return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash) {
                    if( hash === user.password) {
                        console.log(111);
                        done(null, user);
                    } else {
                        console.log(222);
                        done(null, false);
                    }
                }); // hasher
        })
    }
));

app.post(
    '/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
        }
    )
);

app.get('/auth/login', function(req, res){
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    <a href="/auth/register">Register</a>
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/welcome');
});

app.listen(4000, function(){
    console.log('Connected 3006 port!!!');
});
