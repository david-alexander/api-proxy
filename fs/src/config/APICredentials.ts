import { Type } from "class-transformer";
import { ParameterValueWrapperWithName } from "../values/ValueWrapper";

export class APICredentials
{
    @Type(() => String)
    name!: string;

    @Type(() => String)
    api!: string;

    @Type(() => ParameterValueWrapperWithName)
    values!: ParameterValueWrapperWithName[];
}
