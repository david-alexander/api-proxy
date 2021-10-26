import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { ParameterValueSource } from "./Value";

export class FromCredentialsParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    credentialName!: string;

    async getValue(context: ParameterValueContext)
    {
        return await context.credentials[this.credentialName].getValue(context);
    }
}