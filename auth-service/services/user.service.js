const userModel = require('../models/user.model');

class UserService {
	async create({email, password}){
		const user = await userModel.create({email, password});
		return user;
	}
	async findByEmail(email) {
		const user = await userModel.findOne({ email });
		if (!user) {
			return null;
		}
		return user;
	}
}

module.exports = new UserService();
