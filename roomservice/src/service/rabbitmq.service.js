
const amqp = require('amqplib');
const AppService = require('../config/service');

class RabbitMQ {

    constructor() {
        this.channel = null;
        this.connection = null;
    }

    static async connect(queueName) {
        const amqpServer = process.env.DOCKER_RABBITMQ_URL || process.env.RABBITMQ_URL  // || 'amqp://localhost:5672';
        this.connection = await amqp.connect(amqpServer);
        this.channel = await this.connection.createChannel();
        //const queueName = 'PRODUCT'; // Replace with your desired queue name
        await this.channel.assertQueue(queueName);        
        return this.channel;
    }

    static async sendToQueue(queueName, sentData) {
        this.channel.sendToQueue(
            queueName,
            Buffer.from(
                JSON.stringify(sentData)
            )
        );
    }

    static async readFromQueue(queueName) {

        this.channel.consume(queueName, data => {
            let response = JSON.parse(data.content);
            this.channel.ack(data);
            console.log(response);
            return response;
        });

    }


    static async monitorQueues(channel) {

        channel.consume(AppService.ROOM, response => {
            const info = JSON.parse(response.content);
            const data = JSON.stringify(info.data);
            channel.ack(response); //acknowledge the item in the queue

            console.log(`this is the streamed ${data} - ${info}`);

            //notify when bidding start
            //notify highest bidder for each bids
            //notify joining room

            // if (info.type === 'CREATEPRODUCT') {
            //     ProductController.createProduct(data);
            //     RabbitMQ.sendToQueue("PRODUCT", { "status": `Seen. Item sent: ${data}` }
            // );
            // }else if (info.type == 'UPDATEPRODUCT'){
            //     ProductController.updateProduct(data);
            // }else if (info.type == 'DELETEPRODUCT'){
            //     console.log(`data seen for delete ${data}`);
            //     ProductController.deleteProduct(data)
            // }
         
        });

    }
}

module.exports = RabbitMQ;