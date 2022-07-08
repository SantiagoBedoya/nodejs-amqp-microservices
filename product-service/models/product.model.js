const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	createdBy: { type: String, required: true }
}, {
	timestamps: true,
	versionKey: false
});

module.exports = mongoose.model('product', productSchema);
