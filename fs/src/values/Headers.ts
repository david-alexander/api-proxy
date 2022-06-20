import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValueWrapperWithName } from "./ValueWrapper";

export class Headers
{
    @Type(() => ParameterValueWrapperWithName)
    values!: ParameterValueWrapperWithName[];

    @tracedAsyncMethod()
    async getValues(context: ParameterValueContext)
    {
        let result: { [name: string]: string} = {};

        for (let { name, value } of this.values)
        {
            result[name] = await value.getValueAsString(context);
        }

        return result;
    }
}
