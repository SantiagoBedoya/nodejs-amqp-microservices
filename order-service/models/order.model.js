const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	products: [
		{
			name: {type: String, required: true},
			description: {type: String, required: true},
			price: {type: String, required: true },
		}
	],
	userInformation: {
		address: {type: String, required: true },
		email: {type: String, required: true, lowercase: true},
		phone: {type: String, required: true }
	},
	totalPrice: { type: Number, required: true }
}, {
	timestamps: true,
	versionKey: false
});

module.exports = mongoose.model('order', orderSchema);
