import amqp, {Message} from "amqplib";

class MessageBroker {
    channel: any;
    constructor() {
        this.channel = null;
    }

    async connect(){
        console.log("Connecting to RabbitMQ...");

        setTimeout(async () => {
            try{
                //const connection = amqp.connect("amqp://rabbitmq:5672");
                const connection = await  amqp.connect("amqp://localhost");
                this.channel = await connection.createChannel();
                await this.channel.assertQueue("products")
                console.log("RabbitMQ connect")
            }catch(err){
                console.error("Failed to connect to RabbitMQ:", err.message);
            }
        }, 20000)

    }

    async publishMessage(queue:any, message:any) {
        if(!this.channel) {
            console.error("No RabbitMQ channel available")
            console.log("publish")
            return;
        }

        try{
            await this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message))
            );
        }catch(err){
            console.log(err)
        }

    }

    async consumeMessage(queue:any, callback:any){
        if(!this.channel) {
            console.error("No RabbitMQ channel available")
            console.log("cosume")
            return;
        } 

        try{
            await this.channel.consume(queue, (message) => {
                const content = message.content.toString();
                const parsedContent = JSON.parse(content);
                callback(parsedContent);
                this.channel.ack(message);
            });
        }catch(err){
            console.log(err)
        }

    }

}

export const messageBroker = new MessageBroker();