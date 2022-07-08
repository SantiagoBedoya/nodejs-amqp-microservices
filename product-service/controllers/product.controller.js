const { request, response } = require('express');
const productService = require('../services/product.service');

class ProductController {
	async create(req = request, res = response){
		const { name, description, price } = req.body;
		const result = await productService.create({name, description, price, createdBy: req.user });
		if (!result) return res.status(400).json({message: "Product already exists"}); 
		return res.status(201).json(result);
	}
	async buy(req = request, res = response){
		const { ids, userInformation } = req.body;
		const result = await productService.buy({ids, userInformation});
		return res.status(200).json(result);
	}

}
module.exports = new ProductController();
