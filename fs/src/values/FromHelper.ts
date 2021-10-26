import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { ParameterValue, ParameterValueSource } from "./Value";

export class FromHelperParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    helperName!: string;

    @Type(() => String)
    outputName!: string;

    async getValue(context: ParameterValueContext): Promise<ParameterValue>
    {
        return await context.helpers[this.helperName].getOutput(this.outputName);
    }
}