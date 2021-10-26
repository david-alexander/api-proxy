import { ClassConstructor, Type } from "class-transformer";
import { DirectParameterValueSource } from "./Direct";
import { FromCredentialsParameterValueSource } from "./FromCredentials";
import { FromHelperParameterValueSource } from "./FromHelper";
import { FromJSONFileParameterValueSource } from "./FromJSONFile";
import { MoeJSTemplateParameterValueSource } from "./MoeJSTtemplate";
import { ParameterValueSource } from "./Value";

let PARAMETER_VALUE_TYPES:{ value: ClassConstructor<ParameterValueSource>, name: string }[] = [
    { value: DirectParameterValueSource, name: 'direct' },
    { value: FromCredentialsParameterValueSource, name: 'fromCredentials' },
    { value: FromHelperParameterValueSource, name: 'fromHelper' },
    { value: FromJSONFileParameterValueSource, name: 'fromJsonFile' },
    { value: MoeJSTemplateParameterValueSource, name: 'moejsTemplate' }
];

export class ParameterValueWrapper
{
    @Type(() => ParameterValueSource, {
        discriminator: {
          property: 'type',
          subTypes: PARAMETER_VALUE_TYPES,
        },
      })
    value!: ParameterValueSource;
}

export class ParameterValueWrapperWithName
{
    @Type(() => String)
    name!: string;

    @Type(() => ParameterValueSource, {
        discriminator: {
          property: 'type',
          subTypes: PARAMETER_VALUE_TYPES,
        },
      })
    value!: ParameterValueSource;
}
