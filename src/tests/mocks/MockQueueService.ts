import { IQueueAdapter } from "../../interfaces/IQueueAdapter";
import RabbitMQService from "../../infra/messaging/RabbitMQService";

const mockQueueService: IQueueAdapter = new RabbitMQService();

jest.spyOn(mockQueueService, "connect")
    .mockImplementation(async (): Promise<void> => {
        console.log("Mocking connect method");
        return Promise.resolve();
    });

jest.spyOn(mockQueueService, "publish")
    .mockImplementation(async (queue: string, message: any): Promise<void> => {
        console.log(`Mocking publish method with queue: ${queue} and message: ${JSON.stringify(message)}`);
        return Promise.resolve();
    });

jest.spyOn(mockQueueService, "consume")
    .mockImplementation(async (queue: string, callback: (message: any) => Promise<void>): Promise<void> => {
        console.log(`Mocking consume method with queue: ${queue}`);
        await callback({ example: "message" });
        return Promise.resolve();
    });

export default mockQueueService;