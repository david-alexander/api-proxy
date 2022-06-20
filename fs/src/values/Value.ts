import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";

export type ParameterValue = string | number;

export abstract class ParameterValueSource
{
    abstract getValue(context: ParameterValueContext): Promise<ParameterValue>;

    @tracedAsyncMethod()
    async getValueAsString(context: ParameterValueContext)
    {
        return (await this.getValue(context)).toString();
    }
}
