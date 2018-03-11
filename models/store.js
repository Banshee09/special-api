const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    location: {type: String, required:true}
});

module.exports = mongoose.model('Store', storeSchema);
