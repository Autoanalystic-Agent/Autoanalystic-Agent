export declare class AsyncQueueClosedError extends Error {
    constructor(message: string);
}
export declare class AsyncQueue<T> {
    private queue;
    private resolvers;
    private closeResolvers;
    private emptyResolvers;
    private closed;
    enqueue(item: T): void;
    dequeue(): Promise<IteratorResult<T, undefined>>;
    isEmpty(): boolean;
    isClosed(): boolean;
    done(): boolean;
    close(): void;
    /**
     * Wait until the queue is empty
     *
     * if the queue is closed, it will not resolve promise
     * this function only check the queue is empty
     * @returns A promise that resolves when the queue is empty
     */
    waitUntilEmpty(): Promise<void>;
    waitClosed(): Promise<void>;
}
