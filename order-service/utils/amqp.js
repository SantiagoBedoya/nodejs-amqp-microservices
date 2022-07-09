const amqp = require('amqplib');

module.exports = {
	connection: null,
	channel: null,
	async getConnection(queueName) {
		if (!this.connection || !this.channel){
			this.connection = await amqp.connect(process.env.AMQP_SERVER);
			this.channel = await this.connection.createChannel();
			await this.channel.assertQueue(queueName);
		}
		return {connection: this.connection, channel: this.channel };
	},
	async closeConnection() {
		if(this.connection){
			await this.channel.close();
			await this.connection.close();
			this.connection = null;
			this.channel = null;
		}
	}
}

