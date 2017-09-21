// -----------------------------
// :: Router 객체를 사용
// -----------------------------
module.exports = function(passport) {
   var route = require('express').Router();
   var conn = require('../../config/mysql/db')();
   var bkfd2Password = require("pbkdf2-password");
   var hasher = bkfd2Password();

   route.post('/register', function(req, res) {
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

    route.get('/register', function(req, res) {
        res.render('auth/register');
        console.log("Register");
    });

    route.post(
        '/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/welcome',
                failureRedirect: '/login',
                failureFlash: false
            }
        )
    );

    route.get('/login', function(req, res){
        res.render('auth/login')
    });

    route.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/welcome');
    });

    route.get('/facebook',
        passport.authenticate(
            'facebook', {
                scope: 'email'
            }
        )
    );

    route.get('/facebook/callback',
        passport.authenticate(
            'facebook',
            {
                successRedirect: '/welcome',
                failureRedirect: '/login'
            }
        )
    );

    return route;
} ;
