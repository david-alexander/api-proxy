import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValueSource } from "./Value";

export class DirectParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    value!: string;

    @tracedAsyncMethod()
    async getValue(context: ParameterValueContext)
    {
        return this.value;
    }
}
