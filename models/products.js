var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    image_id: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var product = mongoose.model('Products', productSchema);

module.exports = product;