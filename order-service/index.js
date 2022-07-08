require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const amqp = require('./utils/amqp');
const orderService = require('./services/order.service');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
	console.log('order-service database is connected');
});
mongoose.connection.on('disconnected', () => {
	console.log('order-service database is disconnected');
});
mongoose.connection.on('error', (err) => {
	console.log('order-service database error: ', err.message);
});

const queueName = process.env.AMQP_QUEUE_NAME || 'ORDER';
amqp.getConnection(queueName).then(({connection, channel}) => {
	console.log('order-service amqp is connected');
	channel.consume(queueName, async data => {
		const { products, userInformation, channelResponse } = JSON.parse(data.content);
		channel.ack(data);
		const order = await orderService.create({ products, userInformation });	
		channel.sendToQueue(channelResponse, Buffer.from(JSON.stringify(order)));
	});
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
// app.use('/api/v1', require('./routes/order.routes'));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>{
	console.log(`order-service is running on port ${PORT}`);
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
