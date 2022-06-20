import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValueSource } from "./Value";

export class FromCredentialsParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    credentialName!: string;

    @tracedAsyncMethod()
    async getValue(context: ParameterValueContext)
    {
        return await context.credentials[this.credentialName].getValue(context);
    }
}