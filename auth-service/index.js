require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const authService = require('./services/auth.service');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
	console.log('auth-service database is connected');
});
mongoose.connection.on('disconnected', () => {
	console.log('auth-service database is disconnected');
});
mongoose.connection.on('error', (err) => {
	console.log('auth-service database error: ', err.message);
});


const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(rateLimit({
	windowMs: 15*60*100,
	max: 100,
	standardHeaders: false,
	legacyHeaders: false,
}));

// routes
app.use('/api/v1', require('./routes/auth.routes'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>{
	console.log(`auth-service is running on port ${PORT}`);
})
process.on('SIGINT', () => {
	server.close(() => {
		mongoose.connection.close(false, () => {
			console.log('shutting down');
			process.exit(0);
		})
	})
});
process.on('SIGTERM', () => {
	server.close(() => {
		mongoose.connection.close(false, () => {
			console.log('shutting down');
			process.exit(0);
		})
	})
});
