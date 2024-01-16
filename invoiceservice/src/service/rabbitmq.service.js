
const amqp = require('amqplib');
const AppService = require('../config/service');
const httpservice = require('./http.service');
const { use } = require('../routes/invoice.route');
const {create} = require('../controller/invoice.controller');

class RabbitMQ {

    constructor() {
        this.channel = null;
        this.connection = null;
    }

    static async connect(queueName) {
        const amqpServer = process.env.RABBITMQ_URL  || 'amqp://localhost:5672';
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


    static generateInvoiceId(length) {
        const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let invoiceId = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
          invoiceId += alphanumericChars.charAt(randomIndex);
        }
      
        return invoiceId;
      }


    static async monitorQueues(channel) {
        
        channel.consume(AppService.INVOICE, async response => {
            const info = JSON.parse(response.content);
            

            let payload = {
                //room data
                invoice_id: this.generateInvoiceId(6),
                auction_id: JSON.stringify(info.data.id),
                vendor: info.data.name,
                auction: info.data.auction,
                vendor_id:  info.data.u_id,
                auction_date: info.data.createdAt,
                auction_status: info.data.status
            }

            const url = `http://127.0.0.1:8081/api/maxbidding/${payload.auction_id}`

            console.log(url);

            const biddingInstance = await httpservice.get(url, "token");

            console.log("xyz",biddingInstance.data);

            const bidData = biddingInstance.data.data;

            if(!bidData){
                channel.ack(response); //complete before acknowledging incase it fails acknowledge the item in the queue
                console.log("--------------------- bid data don't exist so clear ----------------------");
                return;

            }

            payload = {...payload, bidder: bidData.name, bidder_email: bidData.email, amount: bidData.amount, bidder_id: bidData.u_id }

            const invoiceInstance = await create(payload);

            if(!invoiceInstance.error){

                this.sendToQueue(AppService.NOTIFICATION, {type:'INVOICE', data: invoiceInstance.data.dataValues});

            }

            // console.log(payload);

            console.log(invoiceInstance.data.dataValues);

            channel.ack(response); //complete before acknowledging incase it fails acknowledge the item in the queue

         
        });

    }
}

module.exports = RabbitMQ;