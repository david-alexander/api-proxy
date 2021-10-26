import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { ParameterValueSource } from "./Value";

export class DirectParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    value!: string;

    async getValue(context: ParameterValueContext)
    {
        return this.value;
    }
}
