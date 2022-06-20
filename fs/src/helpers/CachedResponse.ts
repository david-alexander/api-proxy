import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { Headers } from '../values/Headers';
import { ParameterValue } from "../values/Value";
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { Helper, ParameterValueContextForHelper } from "./Helper";

class CachedResponse
{
    public readonly expiry: Date;

    public constructor(public readonly response: string, expiresInSeconds: number)
    {
        this.expiry = new Date(new Date().getTime() + expiresInSeconds * 1000);
    }

    get isValid()
    {
        return this.expiry > new Date();
    }
}

class CachedResponseHelperInstanceStorage
{
    public cachedResponse: CachedResponse | null = null;
}

export class CachedResponseHelper extends Helper<CachedResponseHelperInstanceStorage>
{
    @Type(() => Headers)
    public headers!: Headers;

    @Type(() => Headers)
    public body: Headers | null = null;

    @Type(() => ParameterValueWrapper)
    public endpoint!: ParameterValueWrapper;

    @Type(() => Number)
    public maxAgeSeconds: number | null = null;

    @tracedAsyncMethod()
    private async getResponse(context: ParameterValueContext): Promise<CachedResponse>
    {
        let headers = await this.headers.getValues(context);
        let body = await this.body?.getValues(context) || null;
        let endpoint = await this.endpoint.value.getValueAsString(context);

        let response = await (await fetch(endpoint, { method: body ? 'POST' : 'GET', headers: {'Content-Type': 'application/json', ...headers}, body: body ? JSON.stringify(body) : undefined })).text();
        return new CachedResponse(response, this.maxAgeSeconds || 0);
    }

    @tracedAsyncMethod()
    async getOutput(context: ParameterValueContextForHelper<CachedResponseHelper>, name: string): Promise<ParameterValue>
    {
        if (name == 'response')
        {
            if (!context.instanceStorage.cachedResponse || !context.instanceStorage.cachedResponse.isValid)
            {
                context.instanceStorage.cachedResponse = await this.getResponse(context.context);
            }

            return context.instanceStorage.cachedResponse.response;
        }

        throw 'Unknown output name.';
    }

    createInstanceStorage()
    {
        return new CachedResponseHelperInstanceStorage();
    }
}
