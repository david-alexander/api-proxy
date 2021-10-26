import { ParameterValueContext } from "../Context";

export type ParameterValue = string | number;

export abstract class ParameterValueSource
{
    abstract getValue(context: ParameterValueContext): Promise<ParameterValue>;

    async getValueAsString(context: ParameterValueContext)
    {
        return (await this.getValue(context)).toString();
    }
}
