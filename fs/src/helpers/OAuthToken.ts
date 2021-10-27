import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { Headers } from '../values/Headers';
import { ParameterValue } from "../values/Value";
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { Helper, ParameterValueContextForHelper } from "./Helper";

type OAuthTokenResponse = {
    access_token: string,
    expires_in: number
};

class StoredOAuthToken
{
    accessToken: string;
    expiry: Date;

    public constructor(tokenResponse: OAuthTokenResponse)
    {
        this.accessToken = tokenResponse.access_token;
        this.expiry = new Date(new Date().getTime() + tokenResponse.expires_in * 1000);
    }

    get isValid()
    {
        return this.expiry > new Date();
    }
}

class OAuthTokenHelperInstanceStorage
{
    public storedToken: StoredOAuthToken | null = null;
}

export class OAuthTokenHelper extends Helper<OAuthTokenHelperInstanceStorage>
{
    @Type(() => Headers)
    public headers!: Headers;

    @Type(() => ParameterValueWrapper)
    public getTokenEndpoint!: ParameterValueWrapper;

    private async getToken(context: ParameterValueContext): Promise<StoredOAuthToken>
    {
        let headers = await this.headers.getValues(context);
        let getTokenEndpoint = await this.getTokenEndpoint.value.getValueAsString(context);

        let response: OAuthTokenResponse = await (await fetch(getTokenEndpoint, { method: 'POST', headers })).json();
        return new StoredOAuthToken(response);
    }

    async getOutput(context: ParameterValueContextForHelper<OAuthTokenHelper>, name: string): Promise<ParameterValue>
    {
        if (name == 'token')
        {
            if (!context.instanceStorage.storedToken || !context.instanceStorage.storedToken.isValid)
            {
                context.instanceStorage.storedToken = await this.getToken(context.context);
            }

            return context.instanceStorage.storedToken.accessToken;
        }
        else if (name == 'authorizationHeader')
        {
            return `Bearer ${await this.getOutput(context, 'token')}`;
        }

        throw 'Unknown output name.';
    }

    createInstanceStorage()
    {
        return new OAuthTokenHelperInstanceStorage();
    }
}
