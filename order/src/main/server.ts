import env from "./config/env";

import app from "./config/app";
import amqp from "amqplib";
import { Order } from "../domain/models/order-model";
import { OrderMySQLRepository } from "../infra/db/mysql/repository/order-repository";
import { MySQLHelper } from "../../../product/src/infra/db/mysql/helpers/mysql-helper";
import { CreateOrder } from "../domain/usecases/create-order";

const  setupOrderConsumer = async () => {
  const repository = new OrderMySQLRepository(MySQLHelper)
  console.log("Connecting to RabbitMQ...");

  setTimeout(async () => {
    try {
      //const amqpServer = "amqp://rabbitmq:5672";
      const amqpServer = "amqp://localhost";
      const connection = await amqp.connect(amqpServer);
      console.log("Connected to RabbitMQ");
      const channel = await connection.createChannel();
      await channel.assertQueue("orders");

      channel.consume("orders", async (data) => {
        // Consume messages from the order queue on buy
        console.log("Consuming ORDER service");
        const { products, username, orderId } = JSON.parse(data.content);

        const newOrder:Omit<Order, "createdAt"> = {
          id: orderId,
          products:JSON.stringify(products),
          user: username,
          totalPrice: products.reduce((acc, product) => acc + product.price, 0),
        };

        //console.log(products)

        // Save order to DB
        await repository.create(newOrder);

        // Send ACK to ORDER service
        channel.ack(data);
        console.log("Order saved to DB and ACK sent to ORDER queue");

        // Send fulfilled order to PRODUCTS service
        // Include orderId in the message
        const { user, products: savedProducts, totalPrice } = newOrder//newOrder.toJSON();
        channel.sendToQueue(
          "products",
          Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
        );
      });
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err.message);
    }
  }, 10000); // add a delay to wait for RabbitMQ to start in docker-compose
}

setupOrderConsumer()

app.listen(env.port, () =>
  console.log(`Server running at http://localhost:${env.port}`)

);
