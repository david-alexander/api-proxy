import { plainToClass, Type } from 'class-transformer';
import 'isomorphic-fetch';
import { promisify } from 'util';
import { API } from './API';
import { APICredentials } from './APICredentials';
import { APIEnvironment } from './APIEnvironment';
const readcache:any = require('readcache');

export class Config
{
    @Type(() => API)
    apis!: API[];

    @Type(() => APICredentials)
    apiCredentials!: APICredentials[];

    @Type(() => APIEnvironment)
    apiEnvironments!: APIEnvironment[];

    static async load()
    {
        try
        {
            let fileContents: string = await promisify(readcache)('/config/config.json');
            let configJSON:any = JSON.parse(fileContents);
            let config = plainToClass(Config, configJSON);
            return config;
        }
        catch (e)
        {
            console.error(e);
            return null;
        }
    }
}
