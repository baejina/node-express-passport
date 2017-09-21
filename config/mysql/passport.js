module.exports = function(app) {
    var conn = require('./db')();
    var bkfd2Password = require("pbkdf2-password");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

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
                } else {

                    var user = results[0];
                    return hasher({password: pwd, salt: user.salt}, function(err, pass, salt, hash) {
                            if( hash === user.password) {
                                console.log(111);
                                done(null, user);
                            } else {
                                console.log(222);
                                done(null, false);

                            }
                        })
                    // hasher
                }


            })

        }
    ));

    passport.use(new FacebookStrategy({
          clientID: '512295959121654',
          clientSecret: 'c80c854ab20b7f9089a77721245ae43e',
          callbackURL: "/auth/facebook/callback",
          profileFields: ['id','email', 'gender','link', 'locals', 'name', 'vertified', 'displayName']
      },

      function(accessToken, refreshToken, profile, done) {
          console.log(profile);

          var authId = 'facebook:' + profile.id;
          var sql = 'select * from users where authId=?';

          conn.query(sql, [authId], function(err, results) {
            console.log(err, results);

            if(results.length > 0) {
                done(null, results[0]);
            } else {
                var sql = 'Insert into users set ?';
                var newUser = {
                    'authId': authId,
                    'displayName': profile.displayName,
                }
                conn.query(sql, newUser, function(err, results) {
                    if(err) {
                        console.log(err);
                        done('Err');
                    } else {
                        done(null, newUser);
                    }
                })
            }
          });
      }
    ));

    return passport;

}