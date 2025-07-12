import type { HttpMigration } from "../HttpMigration";
import { IHttpResponse } from "../structures/IHttpResponse";
export declare namespace HttpMigrateRouteFetcher {
    const execute: (props: HttpMigration.IFetchProps) => Promise<unknown>;
    const propagate: (props: HttpMigration.IFetchProps) => Promise<IHttpResponse>;
}
