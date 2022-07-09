const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');

const isAuthenticated = async (req, res, next) => {
	const header = req.headers['authorization'];
	if (!header) {
		return res.status(401).json('Unauthorized');
	}
	const token = header.split(' ')[1];
	const apiUrl = process.env.AUTH_MS_URL || '';
	try {	
		const resp = await axios.post(`${apiUrl}/v1/auth/validate`, {
			token
		});
		req.user = resp.data.userId;
		next();	
	} catch(err) {
		return res.status(401).json('Unauthorized');
	}	
}
module.exports = isAuthenticated;
