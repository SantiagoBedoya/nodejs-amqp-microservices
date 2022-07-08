const userService = require('./user.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
	validate({token}){
		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET);
			return payload;
		} catch(err) {
			console.log(err.message);
			return null;
		}
	}
	async login({email, password}){
		const user = await userService.findByEmail(email);
		if (!user) {
			return null;
		}
		// validate passwords
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) return null;
		const token = jwt.sign({userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
		return token;
	}
	async register({email, password}){
		const user = await userService.findByEmail(email);
		if (user) return null;
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		const newUser = await userService.create({email, password: hash});
		return newUser;
	}
}

module.exports = new AuthService();
