import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { ParameterValueWrapperWithName } from "./ValueWrapper";

export class Headers
{
    @Type(() => ParameterValueWrapperWithName)
    values!: ParameterValueWrapperWithName[];

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
