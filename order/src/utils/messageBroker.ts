import { MySQLHelper } from "../../../product/src/infra/db/mysql/helpers/mysql-helper";
import { OrderMySQLRepository } from "../infra/db/mysql/repository/order-repository";
import env from "../main/config/env";
import amqp, {Message} from "amqplib";

const config =  env

class MessageBroker {
    static async connect() {
      try {
        const connection = await amqp.connect(config.rabbitMQUrl);
        const channel = await connection.createChannel();
  
        // Declare the order queue
        await channel.assertQueue(config.rabbitMQQueue, { durable: true });
  
        // Consume messages from the order queue on buy
        channel.consume(config.rabbitMQQueue, async (message) => {
          try {
            const order = JSON.parse(message.content.toString());
            const orderService = new OrderMySQLRepository(MySQLHelper);
            await orderService.create(order);
            channel.ack(message);
          } catch (error) {
            console.error(error);
            channel.reject(message, false);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  module.exports = MessageBroker;