import { Type } from "class-transformer";
import { ParameterValueContext } from "../Context";
import { ParameterValueSource } from "./Value";
const moeJS:any = require('@toptensoftware/moe-js');

export class MoeJSTemplateParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    template!: string;

    private compiledTemplate: any = null;

    async getValue(context: ParameterValueContext): Promise<string>
    {
        if (!this.compiledTemplate)
        {
            this.compiledTemplate = moeJS.compile(this.template, { asyncTemplate: true });
        }
        return await this.compiledTemplate(context);
    }
}
