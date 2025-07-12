export declare namespace StringUtil {
    const capitalize: (str: string) => string;
    const escapeDuplicate: (props: {
        keep: string[];
        input: string;
        escape?: (str: string) => string;
    }) => string;
}
