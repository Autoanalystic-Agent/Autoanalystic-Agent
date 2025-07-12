export declare class MPSC<T> {
    private readonly queue;
    readonly consumer: ReadableStream<T>;
    constructor();
    produce(chunk: T): void;
    close(): void;
    done(): boolean;
    waitClosed(): Promise<void>;
    waitUntilEmpty(): Promise<void>;
}
