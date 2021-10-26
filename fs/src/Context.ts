import { Helper, HelperWithContext } from "./helpers/Helper";
import { HelperInstance } from "./helpers/HelperInstance";
import { ParameterValueSource } from "./values/Value";
import { ParameterValueWrapperWithName } from "./values/ValueWrapper";

export class ParameterValueContext
{
    public timestamp = new Date();
    public readonly helpers: { [name: string]: HelperWithContext<Helper<unknown>> } = {};
    public readonly credentials: { [name: string]: ParameterValueSource } = {};

    public constructor(helpers: HelperInstance[], credentials: ParameterValueWrapperWithName[], private readonly helperInstanceStorage: { [helperName: string]: unknown })
    {
        for (let { name, helper } of helpers)
        {
            let helperInstanceStorage = this.helperInstanceStorage[name] = this.helperInstanceStorage[name] || helper.createInstanceStorage();
            this.helpers[name] = new HelperWithContext(helper, this, helperInstanceStorage);
        }
        for (let { name, value } of credentials)
        {
            this.credentials[name] = value;
        }
    }
}