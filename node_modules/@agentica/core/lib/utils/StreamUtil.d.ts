/**
 * @module StreamUtil
 *
 * Utility functions for streams.
 */
declare function readAll<T>(stream: ReadableStream<T>): Promise<T[]>;
declare function reduce<T, R = T>(stream: ReadableStream<T>, reducer: (acc: T | R, cur: T) => R, initial?: R): Promise<R | null>;
declare function from<T>(value: T): ReadableStream<T>;
export declare function toAsyncGenerator<T>(value: T): AsyncGenerator<T, undefined, undefined>;
export declare function streamDefaultReaderToAsyncGenerator<T>(reader: ReadableStreamDefaultReader<T>): AsyncGenerator<Awaited<T>, undefined, undefined>;
declare function transform<T, R>(stream: ReadableStream<T>, transformer: (value: T) => R): ReadableStream<R>;
export declare const StreamUtil: {
    readAll: typeof readAll;
    reduce: typeof reduce;
    from: typeof from;
    transform: typeof transform;
};
export {};
