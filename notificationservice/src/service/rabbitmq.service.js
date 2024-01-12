const amqp = require("amqplib");
const AppService = require("../config/service");

class RabbitMQ {
  constructor() {
    this.channel = null;
    this.connection = null;
  }

  static async connect(queueName) {
    const amqpServer = process.env.RabbitMQ_UR || "amqp://localhost:5672";
    this.connection = await amqp.connect(amqpServer);
    this.channel = await this.connection.createChannel();
    //const queueName = 'PRODUCT'; // Replace with your desired queue name
    await this.channel.assertQueue(queueName);
    return this.channel;
  }

  static async sendToQueue(queueName, sentData) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(sentData)));
  }

  static async readFromQueue(queueName) {
    this.channel.consume(queueName, (data) => {
      let response = JSON.parse(data.content);
      this.channel.ack(data);
      console.log(response);
      return response;
    });
  }

  static async monitorQueues(channel) {
    const NOTICETYPE = {
      ROOMCREATE: "ROOMCREATE",
      ROOMJOIN: "ROOMJOIN",
      ROOMUPDATE: "ROOMUPDATE",
      BIDDING: "BIDDING",
      INVOICE: "INVOICE"
    };

    channel.consume(AppService.NOTIFICATION, (response) => {

      const info = JSON.parse(response.content);
      const data = info.data //   JSON.stringify(info.data);

    //   console.log(info);

      if(global.io == undefined){
        channel.ack(response); //acknowledge queue object
        console.log("---------------------io is undefined----------------------");
        return;
      }

      if (info.type == NOTICETYPE.ROOMCREATE) {

        global.io.emit(NOTICETYPE.ROOMCREATE, {data});

      } else if (info.type == NOTICETYPE.ROOMJOIN) {

        global.io.emit(NOTICETYPE.ROOMJOIN, {data});

      } else if (info.type == NOTICETYPE.ROOMUPDATE) {

        global.io.emit(NOTICETYPE.ROOMUPDATE, {}); // room closed

        this.sendToQueue(AppService.INVOICE, {type:'closed', data: info.data});

      } else if (info.type == NOTICETYPE.BIDDING) {

        global.io.emit(NOTICETYPE.BIDDING, {});

        //trigger for bidding request.
      }else if(info.type == NOTICETYPE.INVOICE){

        console.log(info)
        global.io.to(`${info.data.bidder_id}`).emit(NOTICETYPE.INVOICE, info); //invoice ready
      }

    channel.ack(response); //acknowledge queue object
      
    });
  }
}

module.exports = RabbitMQ;
