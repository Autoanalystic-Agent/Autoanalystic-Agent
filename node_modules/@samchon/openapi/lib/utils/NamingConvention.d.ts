export declare namespace NamingConvention {
    function snake(str: string): string;
    function camel(str: string): string;
    function pascal(str: string): string;
    const capitalize: (str: string) => string;
    const variable: (str: string) => boolean;
    const reserved: (str: string) => boolean;
}
