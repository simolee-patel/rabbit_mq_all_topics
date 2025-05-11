const amqp = require("amqplib");

async function receiveMessage() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "topic";
        const queue = "order_queue";

        await channel.assertExchange(exchange, exchangeType, { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, "order.*");

        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue, (data) => {
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
