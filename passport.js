var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.username);
});

passport.deserializeUser(function(username, done){
    User.findOne({username: username}, function(err, user){
        done(err, user);
    });
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username : username}, function(err, user){
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Invalid username or password, try again.'})
            }
            user.checkPassword(password, function(err, isMatch){
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, {message: 'Invalid password'});
                }
                return done(null, user);
            });
        });
    }
));