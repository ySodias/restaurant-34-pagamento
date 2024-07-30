import { Channel, connect, Connection } from "amqplib";

import { IQueueAdapter } from "../../interfaces/IQueueAdapter";

export class RabbitMQService implements IQueueAdapter {
    private connection!: Connection;
    private channel!: Channel;
    private readonly rabbitMQUrl: string = process.env.RABBITMQ_URL as string;

    async connect(): Promise<void> {
        try {
            this.connection = await connect(this.rabbitMQUrl);
            this.channel = await this.connection.createChannel();
            console.log('Connection to RabbitMQ has been successfully established');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    }

    async publish(queue: string, message: any): Promise<void> {
        if (!this.channel) throw new Error('Channel not initialized');
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (message: any) => Promise<void>): Promise<void> {
        if (!this.channel) throw new Error('Channel not initialized');
        await this.channel.assertQueue(queue, { durable: true });
        console.log(`Consuming ${queue}`);
        this.channel.consume(queue, async (msg) => {
            if (msg) {
                await callback(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
    }
}

export default RabbitMQService;