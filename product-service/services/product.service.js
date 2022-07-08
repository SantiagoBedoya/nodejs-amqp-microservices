const productModel = require('../models/product.model');
const amqp = require('../utils/amqp');

class ProductService {
	async create({name, description, price, createdBy}){
		const existingProduct = await productModel.findOne({ name });
		if (existingProduct) return null;
		const product = await productModel.create({name, description, price, createdBy});
		return product;
	}
	buy({ids, userInformation}){
		return new Promise(async (resolve, reject) => {
			const products = await productModel.find({ _id: {$in: ids }});
			const { channel } = await amqp.getConnection('PRODUCT');
			channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({products, userInformation, channelResponse: 'PRODUCT'})));
			channel.prefetch(1);
			channel.consume('PRODUCT', data => {
				const order = JSON.parse(data.content);
				resolve(order)
			})
		})
	}
}

module.exports = new ProductService();
