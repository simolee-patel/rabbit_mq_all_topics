const amqp = require("amqplib")

async function sendMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange="mail_exchange";
        const routingKey ="send_mail";
        const exchange_type="direct";

        const message={
            title:"Job applictaion for senior backend developer",
            from:"abc",
            to:"simolee patel",
            body:"Congratulations!!, you are selected for this role as senior software developer"
        };

        await channel.assertExchange(exchange,exchange_type,{"durable":false});
        await channel.assertQueue("mail_queue",{"durable":false});
        await channel.bindQueue("mail_queue",exchange,routingKey);


        await channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)));
        console.log("message send", message);

        setTimeout(() => {
            connection.close()
        }, 500);
        
    }catch(err){
        console.log("error in connection", err);
    }
}

sendMail()