const amqp = require("amqplib");

async function sendMessage(routingKey, data) {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "topic";

        await channel.assertExchange(exchange, exchangeType, { durable: false });

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));

        console.log("Message sent:", routingKey, data);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (err) {
        console.error("Error in connection", err);
    }
}

// Send messages
sendMessage("order.placed", {
    name: "order",
    message: "Order placed successfully!!"
});

sendMessage("payment.processed", {
    name: "payment",
    message: "Payment processed successfully!!"
});
