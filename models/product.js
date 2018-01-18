const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    barcode: {type: String, required:true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}
});

productSchema.index({barcode:1});
productSchema.index({category:1});

module.exports = mongoose.model('Product', productSchema);