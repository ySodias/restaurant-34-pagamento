export interface IQueueAdapter {
    connect(): Promise<void>;
    publish(queue: string, message: any): Promise<void>;
    consume(queue: string, callback: (message: any) => Promise<void>): Promise<void>;
}
