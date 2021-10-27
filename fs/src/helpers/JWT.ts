import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { Headers } from '../values/Headers';
import { ParameterValue } from "../values/Value";
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { Helper, ParameterValueContextForHelper } from "./Helper";
import jwtDecode from "jwt-decode";

class StoredJWT
{
    accessToken: string;
    expiry: Date;

    public constructor(rawToken: string)
    {
        let decoded = jwtDecode(rawToken) as { exp: number };
        this.accessToken = rawToken;
        this.expiry = new Date(decoded.exp * 1000);
    }

    get isValid()
    {
        return this.expiry > new Date();
    }
}

class JWTHelperInstanceStorage
{
    public storedToken: StoredJWT | null = null;
}

export class JWTHelper extends Helper<JWTHelperInstanceStorage>
{
    @Type(() => ParameterValueWrapper)
    public rawToken!: ParameterValueWrapper;

    private async getToken(context: ParameterValueContext): Promise<StoredJWT>
    {
        let rawToken = await this.rawToken.value.getValueAsString(context);
        return new StoredJWT(rawToken);
    }

    async getOutput(context: ParameterValueContextForHelper<JWTHelper>, name: string): Promise<ParameterValue>
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
        return new JWTHelperInstanceStorage();
    }
}
