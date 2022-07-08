const { request, response } = require('express');
const authService = require('../services/auth.service');

class AuthController {
	async validate(req = request, res = response) {
		const { token } = req.body;
		const user = await authService.validate({token});
		if (!user) {
			return res.status(401).json('Unauthorized');
		}
		return res.status(200).json(user);
	}
	async register(req = request, res = response){
		const {email, password} = req.body;
		const result = await authService.register({email, password});
		if (!result) return res.status(400).json({message: 'email is already in use'});
		return res.status(201).json(result);
	}
	async login(req = request, res = response) {
		const { email, password } = req.body;
		const result = await authService.login({ email, password });
		if (!result) return res.status(401).json({message: "unauthorized"});
		return res.status(200).json({status: "success", accessToken: result });
	}
}
module.exports = new AuthController();
