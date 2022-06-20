import { Type } from "class-transformer";
import * as _ from 'lodash';
import { promisify } from "util";
import { ParameterValueContext } from "../Context";
import { tracedAsyncMethod } from "../util/Tracing";
import { ParameterValue, ParameterValueSource } from "./Value";
const readcache:any = require('readcache');

export class FromJSONFileParameterValueSource extends ParameterValueSource
{
    @Type(() => String)
    filePath!: string;

    @Type(() => String)
    keyPath!: string;

    @tracedAsyncMethod()
    async getValue(context: ParameterValueContext): Promise<ParameterValue>
    {
        let fileContents: string = await promisify(readcache)(this.filePath);
        let json = JSON.parse(fileContents);
        return _.get(json, this.keyPath);
    }
}