const amqp = require("amqplib")

async function receivevemessage(){
            const connection = await amqp.connect("amqp://localhost");
            const channel = await connection.createChannel();

            const exchange="notification_exchange";
            const exchange_type="topic";
            const queue="payment_queue"

            await channel.assertExchange(exchange,exchange_type,{durable:false});
            await channel.assertQueue(queue,{durable:false});

            await channel.bindQueue(queue,exchange,"payment.*")

            channel.consume(queue,(data)=>{
                console.log(JSON.parse(data.content));
                channel.ack(data)               
            })
}
receivevemessage();