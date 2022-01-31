import { Type } from "class-transformer";
import { HelperInstance } from "../helpers/HelperInstance";
import { Headers } from '../values/Headers';
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { APIRoute } from "./APIRoute";

export class APIThrottling
{
    @Type(() => Number)
    maxRequestsPerSecond!: number;

    @Type(() => String)
    mode!: /*'respondWith429' | */'wait';
}

export class API
{
    @Type(() => String)
    name!: string;

    @Type(() => HelperInstance)
    helpers!: HelperInstance[];

    @Type(() => ParameterValueWrapper)
    baseURL!: ParameterValueWrapper;
    
    @Type(() => Headers)
    headers!: Headers;

    @Type(() => APIRoute)
    routes!: APIRoute[];

    @Type(() => APIThrottling)
    throttling: APIThrottling | null = null;

    findMatchingRoute(path: string)
    {
        return this.routes.find(r => r.matches(path)) || null;
    }
}
