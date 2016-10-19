var express = require('express');
var passport = require('passport');
var router = express.Router();
var validator = require('validator');
var User = require('../models/user');
var Promotion = require('../models/promotions');

/* GET home page. */
router.get('/', function(req, res, next){
    Promotion.find({'display': true}).exec(function(err, docs){
        if (err) {
            return res.redirect('/');
        }
        res.render('index', { title: 'Delux CLothing', 'promotions': docs});
    });
});

router.get('/login', function(req, res, next){
  res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/signup', function(req, res, next){
    var username = req.body.n_username;
    var password = req.body.n_password;
    var email = req.body.n_email;
    var error = false;
    if ( !validator.isLength(password, {min: 8, max: undefined})) {
        req.flash('error', 'Mot de passe doit avoir 8 caracteres');
        err = true;
    }
    if (!validator.isLength(username, {min: 6, max: undefined})) {
        req.flash('error', 'Votre nom d\'utilisateur doit avoir aumoins 6 caracteres.');
        error = true;
    }
    if (!validator.isEmail(email)) {
        req.flash('error', 'Votre email n\'est pas valide.');
        error = true;
    }
    if (error == true) {
        return res.redirect('/login');
    }
    User.findOne({username: username}, function(err, user){
        if (err) {
            return next(err);
        }
        if (user) {
            req.flash('error', 'User name already taken');
            return res.redirect('/login');
        }
        var user = new User({
            username: username,
            password: password,
            email: email
        });
        user.save(next);
        req.flash('info', 'user created successfully. Login now');
        res.redirect('/login')
    });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
