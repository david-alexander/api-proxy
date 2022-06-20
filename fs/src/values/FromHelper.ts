import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValue, ParameterValueSource } from "./Value";

export class FromHelperParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    helperName!: string;

    @Type(() => String)
    outputName!: string;

    @tracedAsyncMethod()
    async getValue(context: ParameterValueContext): Promise<ParameterValue>
    {
        return await context.helpers[this.helperName].getOutput(this.outputName);
    }
}