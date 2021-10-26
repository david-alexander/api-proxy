import { Type } from "class-transformer";
import { ParameterValue } from "../values/Value";
import { ParameterValueWrapper } from "../values/ValueWrapper";
import { Helper, ParameterValueContextForHelper } from "./Helper";

export class BasicAuthHelper extends Helper<void>
{
    @Type(() => ParameterValueWrapper)
    username!: ParameterValueWrapper;

    @Type(() => ParameterValueWrapper)
    password!: ParameterValueWrapper;

    async getOutput(context: ParameterValueContextForHelper<BasicAuthHelper>, name: string): Promise<ParameterValue>
    {
        if (name == 'digest')
        {
            let username = await this.username.value.getValue(context.context);
            let password = await this.password.value.getValue(context.context);
            return Buffer.from(`${encodeURIComponent(username)}:${encodeURIComponent(password)}`, 'utf8').toString('base64');
        }
        else if (name == 'authorizationHeader')
        {
            return `Basic ${await this.getOutput(context, 'digest')}`;
        }

        throw 'Unknown output name.';
    }

    createInstanceStorage() {}
}
