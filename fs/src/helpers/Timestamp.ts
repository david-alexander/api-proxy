import { tracedAsyncMethod } from "../util/Tracing";
import { Helper, ParameterValueContextForHelper } from "./Helper";

export class TimestampHelper extends Helper<void>
{
    @tracedAsyncMethod()
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
