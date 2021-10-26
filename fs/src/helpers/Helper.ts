import { ParameterValueContext } from "../Context";
import { ParameterValue } from "../values/Value";

export abstract class Helper<TInstanceStorage>
{
    abstract getOutput(context: ParameterValueContextForHelper<Helper<TInstanceStorage>>, name: string): Promise<ParameterValue>;

    abstract createInstanceStorage(): TInstanceStorage;
}

type HelperInstanceStorage<THelper extends Helper<unknown>> =
    THelper extends Helper<infer TInstanceStorage> ? TInstanceStorage : never;

export class HelperWithContext<THelper extends Helper<unknown>>
{
    public constructor(private helper: THelper, private context: ParameterValueContext, private instanceStorage: HelperInstanceStorage<THelper>)
    {

    }

    async getOutput(name: string): Promise<ParameterValue>
    {
        let helperContext = new ParameterValueContextForHelper<THelper>(this.context, this.instanceStorage);
        return await this.helper.getOutput(helperContext, name);
    }
}

export class ParameterValueContextForHelper<THelper extends Helper<unknown>>
{
    public constructor(public readonly context: ParameterValueContext, public readonly instanceStorage: HelperInstanceStorage<THelper>)
    {

    }
}
