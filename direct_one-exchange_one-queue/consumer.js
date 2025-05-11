const amqp = require("amqplib")

async function receiveMail(){
            const connection = await amqp.connect("amqp://localhost");
            const channel = await connection.createChannel();

            await channel.assertQueue("mail_queue",{"durable":false});
            channel.consume("mail_queue",(data)=>{
                console.log(JSON.parse(data.content));
                channel.ack(data)
                
            })
}
receiveMail();