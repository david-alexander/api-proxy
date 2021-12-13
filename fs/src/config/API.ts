import { Type } from "class-transformer";
import { HelperInstance } from "../helpers/HelperInstance";
import { Headers } from '../values/Headers';
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { APIRoute } from "./APIRoute";

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

    findMatchingRoute(path: string)
    {
        return this.routes.find(r => r.matches(path)) || null;
    }
}
