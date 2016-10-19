var mongoose = require('mongoose');
var mongoosePaginator = require('mongoose-paginate');
var bcrypt = require('bcrypt-nodejs');
var salt = 10;

var userSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
userSchema.plugin(mongoosePaginator);
function noop(){}

userSchema.pre('save', function(done){
    var user = this;
    if(!user.isModified('password')) {
        return done();
    }
    bcrypt.genSalt(salt, function(err, salt){
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
            if (err) {
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch){
        done(err, isMatch);
    })
};

var User = mongoose.model('User', userSchema);

module.exports = User;