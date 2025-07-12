export declare namespace EndpointUtil {
    const capitalize: (str: string) => string;
    const pascal: (path: string) => string;
    const splitWithNormalization: (path: string) => string[];
    const reJoinWithDecimalParameters: (path: string) => string;
    const normalize: (str: string) => string;
    const escapeDuplicate: (keep: string[]) => (change: string) => string;
}
