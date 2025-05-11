const amqp = require("amqplib")

async function sendMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange="mail_exchange";
        const exchange_type="direct";

        const subscriber_key ="send_mail_to_subscribed_user";
        const users_key ="send_mail_to_user";

        const subscriber_queue="subscribed_users_mail_queue";
        const users_queue="users_mail_queue";


        const message_for_subscribers={
            title:"you are subscriber!!",
            from:"abc",
            to:"simolee patel",
            body:"Congratulations!!, you are subscriber now!!"
        };

        const message_for_users={
            title:"you are not subscriber yet!!",
            from:"abc",
            to:"harry patel",
            body:"hit the subscribe button to subscribe the channel!!"
        };

        await channel.assertExchange(exchange,exchange_type,{"durable":false});

        await channel.assertQueue(subscriber_queue,{"durable":false});
        await channel.bindQueue(subscriber_queue,exchange,subscriber_key);

        await channel.assertQueue(users_queue,{"durable":false});
        await channel.bindQueue(users_queue,exchange,users_key);


        await channel.publish(exchange,subscriber_key,Buffer.from(JSON.stringify(message_for_subscribers)));
        await channel.publish(exchange,users_key,Buffer.from(JSON.stringify(message_for_users)));

        console.log("message send");

        setTimeout(() => {
            connection.close()
        }, 500);
        
    }catch(err){
        console.log("error in connection", err);
    }
}

sendMail()