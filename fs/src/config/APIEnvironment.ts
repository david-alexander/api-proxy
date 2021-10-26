import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { Config } from "./Config";

export class APIEnvironment
{
    @Type(() => String)
    name!: string;

    @Type(() => String)
    credentials!: string;

    @Type(() => Boolean)
    fullAccess!: boolean;

    private helperInstanceStorage: { [helperName: string]: unknown } = {};
    
    createContext(config: Config)
    {
        let credentials = config.apiCredentials.find(c => c.name == this.credentials)!;
        let api = config.apis.find(a => a.name == credentials.api)!;

        return {
            credentials,
            api,
            context: new ParameterValueContext(api.helpers, credentials.values, this.helperInstanceStorage)
        };
    }
}
