const orderModel = require('../models/order.model');

class OrderService {
	async create({products, userInformation}){
		let totalPrice = 0;
		products.forEach(item => totalPrice += item.price);
		const order = await orderModel.create({products, userInformation, totalPrice});
		return order;
	}
}

module.exports = new OrderService();
