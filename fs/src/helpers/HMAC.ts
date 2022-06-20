import { Type } from "class-transformer";
import * as crypto from 'crypto';
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { Helper, ParameterValueContextForHelper } from "./Helper";

export class HMACHelper extends Helper<void>
{
    @Type(() => String)
    algorithm!: string;

    @Type(() => String)
    digestFormat!: crypto.BinaryToTextEncoding;

    @Type(() => ParameterValueWrapper)
    message!: ParameterValueWrapper;

    @Type(() => ParameterValueWrapper)
    key!: ParameterValueWrapper;

    @tracedAsyncMethod()
    async getOutput(context: ParameterValueContextForHelper<HMACHelper>, name: string)
    {
        if (name == 'digest')
        {
            let message = await this.message.value.getValueAsString(context.context);
            let key = await this.key.value.getValueAsString(context.context);
            let hmac = crypto.createHmac(this.algorithm, Buffer.from(key, 'utf8'));
            hmac.update(message);
            return hmac.digest(this.digestFormat);
        }

        throw 'Unknown output name.';
    }

    createInstanceStorage() {}
}