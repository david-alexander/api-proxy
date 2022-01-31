import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { Config } from "./Config";

import type ThrottledQueue from 'throttled-queue';
const tq: typeof ThrottledQueue = require('throttled-queue');

export class APIEnvironment
{
    @Type(() => String)
    name!: string;

    @Type(() => String)
    credentials!: string;

    @Type(() => Boolean)
    fullAccess!: boolean;

    private helperInstanceStorage: { [helperName: string]: unknown } = {};

    private throttledQueue: ReturnType<typeof ThrottledQueue> = null!;
    
    createContext(config: Config)
    {
        let credentials = config.apiCredentials.find(c => c.name == this.credentials)!;
        let api = config.apis.find(a => a.name == credentials.api)!;
        
        if (!this.throttledQueue)
        {
            this.throttledQueue = async (fn) => await fn(); 

            if (api.throttling)
            {
                if (api.throttling.mode == 'wait')
                {
                    this.throttledQueue = tq(api.throttling.maxRequestsPerSecond, 1000, true);
                }
                else
                {
                    throw 'Not implemented';
                }
            }
        }

        return {
            credentials,
            api,
            context: new ParameterValueContext(api.helpers, credentials.values, this.helperInstanceStorage)
        };
    }

    public async throttleRequest<TResult>(fn: () => Promise<TResult>)
    {
        return await this.throttledQueue(fn);
    }
}
