import { OpenApi } from "@samchon/openapi";
export declare const _randomArray: <T>(props: Omit<OpenApi.IJsonSchema.IArray, "items"> & {
    element: (index: number, count: number) => T;
}) => any[];
