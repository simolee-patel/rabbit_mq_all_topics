const amqp = require("amqplib");

async function receiveMessage() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });
        const queue = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(queue.queue, exchange, "");

        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue.queue, (data) => {
            if (data !== null) {
                const message = JSON.parse(data.content.toString());
                console.log("Received message:", message);
                channel.ack(data);
            }
        });

    } catch (err) {
        console.error("Error receiving message:", err);
    }
}

receiveMessage();
