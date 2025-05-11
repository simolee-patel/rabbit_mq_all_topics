const amqp = require("amqplib");

async function sendannouncement(product) {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(JSON.stringify(product)));

        console.log("Message sent:", product);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (err) {
        console.error("Error in connection", err);
    }
}

// Send messages
sendannouncement({
    name: "push_notification",
    message: "Order placed successfullythis is fanout type!"
});
