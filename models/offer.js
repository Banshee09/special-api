const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: {type: Number, required:true},
    date: {type: Date, required:true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true}
});

offerSchema.index({ store: 1, product: -1 }, { unique: true })

module.exports = mongoose.model('Offer', offerSchema);