var router = require('express').Router();
var validator = require('validator');
var mutipartMiddleware = require('connect-multiparty')();
var Promotion = require('../models/promotions');
var User = require('../models/user');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dvpgqt7jv',
    api_key: 413922872947885,
    api_secret: '43tVDdO2LcvFsWqOn3fRhGtNSIE'
});

router.use(function(req, res, next){
    if(req.user.isAdmin) {
        next();
    }
    else {
        res.redirect('/');
    }
});
router.get('/', function(req, res){
    res.render('admin/layout');
});


router.post('/delete', function(req, res) {
    var collection = req.body.type;
    collection = collection.split('#')[0];
    if (collection === 'promotions'){
        Promotion.findOne({'_id': req.body.id}).remove().exec(function (err) {
            if (err) {
                return res.json({error: 'This element was not found on your system.'});
            }
            return res.json({success: true});
        });
    }
    else if (collection === 'users') {
        User.findOne({'_id': req.body.id}).remove().exec(function (err) {
            if (err) {
                return res.json({error: 'This element was not found on your system.'});
            }
            return res.json({success: true});
        });
    }
    else {
        return res.json({success: false});
    }
});

router.get('/promotions', function(req, res){
    var p = req.query.page || "1";
    var l = req.query.limit || "10";
    if (validator.isInt(p) && validator.isInt(l)) {
        p = parseInt(p);
        l = parseInt(l);
        Promotion.paginate({}, {sort: {'display': -1, 'createdAt': -1}, page: p, limit: l}).then(function (result) {
            return res.render('admin/promotions', {result: result, limit: l});
        });
    }
    else {
        req.flash('error', 'Invalid query strings they should be numbers');
        res.redirect('/admin/promotions');
    }
});
router.post('/promotions', function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var display = req.body.display || false;
    var error = false;

    if (!validator.isLength(title, {min: 3, max: undefined})) {
        req.flash('error', 'Your Promotion title is short!');
        error = true;
    }
    if (!validator.isLength(content, {min: 4, max: 100})) {
        req.flash('error', 'Your Promotion content should be at least 4 and max 100 characters!');
        error = true;
    }
    if (error) {
        return res.redirect('/admin/promotions');
    }

    var promotion = new Promotion({
        title : title,
        content: content,
        display: display
    });

    promotion.save(function(err){
        if(err) {
            req.flash('error', 'This promotion title is already taken');
            return res.redirect('/admin/promotions');
        }
        req.flash('info', 'Promotion added succesfully');
        res.redirect('/admin/promotions');
    });


});

router.get('/promotions/:id', function(req, res){
    Promotion.find({'_id': req.params.id}).exec(function(err, promotion){
       if (err) {
           req.flash('error', 'error encountered');
       }
       res.render('admin/edit_promotion', {promotion: promotion[0]});
    });
});
router.post('/promotions/:id', function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var display = req.body.display || false;
    var error = false;

    if (!validator.isLength(title, {min: 3, max: undefined})) {
        req.flash('error', 'Your Promotion title is short!');
        error = true;
    }
    if (!validator.isLength(content, {min: 4, max: 100})) {
        req.flash('error', 'Your Promotion content should be at least 4 and max 100 characters!');
        error = true;
    }
    if (error) {
        return res.redirect('/admin/promotions');
    }
   Promotion.findOne({'_id': req.params.id}).exec(function(err, promotion){
     if (err) {
         req.flash('error', 'Oups something went wrong!');
         return res.redirect('/admin');
     }
     if (!promotion) {
         req.flash('error', 'Promotion not found');
         return res.redirect('/admin/promotions');
     }
     promotion.content = content;
   promotion.display = display;
   promotion.title = title;
   promotion.save();
   req.flash('info', 'Succesfull updated this promotion');
   res.redirect('/admin/promotions');
   });
});

router.get('/users', function(req, res){
    var p = req.query.page || "1";
    var l = req.query.limit || "10";
    if (validator.isInt(p) && validator.isInt(l)) {
        p = parseInt(p);
        l = parseInt(l);
        User.paginate({}, {select: {'username': 1, 'email': 1, 'isAdmin': 1, 'createdAt': 1}}, {sort: {'isAdmin': 1, 'createdAt': -1}, page: p, limit: l}).then(function (result) {
            return res.render('admin/users', {result: result, limit: l});
        });
    }
    else {
        req.flash('error', 'Invalid query strings they should be numbers');
        res.redirect('/admin/users');
    }
});

router.get('/products', function(req, res){
    res.render('admin/product');
});

router.post('/products', mutipartMiddleware,function(req, res){
    cloudinary.uploader.upload(req.files.image.path, function(result){
        console.log(result);
        res.redirect('/admin');
    })
});

module.exports = router;