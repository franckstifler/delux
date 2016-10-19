var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//var mongooseTimestamp = require('mongoose-timestamp');

var promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content: {
        type: String
    },
    display: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

promotionSchema.plugin(mongoosePaginate);
//promotionSchema.plugin(mongooseTimestamp);

var handleE11000 = function(error, res, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next();
    }
};

promotionSchema.post('save', handleE11000);
promotionSchema.post('update', handleE11000);
promotionSchema.post('findOneAndUpdate', handleE11000);
promotionSchema.post('insertMany', handleE11000);
var promotions = mongoose.model('Promotions', promotionSchema);

module.exports = promotions;