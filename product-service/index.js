require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const amqp = require('./utils/amqp');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
	console.log('product-service database is connected');
});
mongoose.connection.on('disconnected', () => {
	console.log('product-service database is disconnected');
});
mongoose.connection.on('error', (err) => {
	console.log('product-service database error: ', err.message);
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
app.use('/api/v1', require('./routes/product.routes'));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>{
	console.log(`product-service is running on port ${PORT}`);
})
process.on('SIGINT', () => {
	server.close(() => {
		mongoose.connection.close(false, () => {
			amqp.closeConnection().then(() => {
				console.log('shutting down');
				process.exit(0);
			})
		})
	})
});
process.on('SIGTERM', () => {
	server.close(() => {
		mongoose.connection.close(false, () => {
			amqp.closeConnection().then(() => {
				console.log('shutting down');
				process.exit(0);
			})
		})
	})
});
