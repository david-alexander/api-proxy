import { Helper, ParameterValueContextForHelper } from "./Helper";

export class TimestampHelper extends Helper<void>
{
    async getOutput(context: ParameterValueContextForHelper<TimestampHelper>, name: string)
    {
        if (name == 'timestamp')
        {
            return Math.floor(context.context.timestamp.getTime() / 1000);
        }

        throw 'Unknown output name.';
    }

    createInstanceStorage() {}
}
