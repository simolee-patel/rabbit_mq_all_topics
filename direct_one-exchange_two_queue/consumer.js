const amqp = require("amqplib")

async function receiveMail(){
            const connection = await amqp.connect("amqp://localhost");
            const channel = await connection.createChannel();

            await channel.assertQueue("subscribed_users_mail_queue",{"durable":false});
            channel.consume("subscribed_users_mail_queue",(data)=>{
                console.log(JSON.parse(data.content));
                channel.ack(data)               
            })
}
receiveMail();