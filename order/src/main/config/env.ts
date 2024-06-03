export default {
    postgresUrl: "postgresql://postgres:teste@localhost:5432/pg_node_test",
    rabbitMQUrl: 'amqp://localhost',
    rabbitMQQueue: 'orders',
    port: process.env.PORT || 8002,
  };
  