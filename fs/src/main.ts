import * as http from 'http';
import * as httpProxy from 'http-proxy';
import 'reflect-metadata';
import { APIEnvironment } from './config/APIEnvironment';
import { Config } from "./config/Config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main()
{
    let proxy = httpProxy.createProxyServer({
        proxyTimeout: 60 * 60 * 1000,
        // ws: true
    });

    async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse, environment: APIEnvironment, config: Config)
    {
        let { credentials, api, context } = environment.createContext(config);

        if (req.method != 'GET' && !environment.fullAccess)
        {
            res.writeHead(405);
            res.end('Method Not Allowed');
            return;
        }

        let baseURL = await api.baseURL.value.getValueAsString(context);
        let headers = await api.headers.getValues(context);

        for (let key in headers)
        {
            req.headers[key] = headers[key];
        }

        proxy.web(req, res, { target: baseURL, changeOrigin: true, secure: false }, (err: any) => {
            console.log(err);
            if (!res.headersSent)
            {
                res.writeHead(502);
            }
            res.end('Bad Gateway');
        });
    }
    
    let config = await Config.load();

    let httpServer = http.createServer((req, res) => {
        if (!config)
        {
            res.writeHead(503);
            res.end('Config not loaded');
            return;
        }
        for (let environment of config.apiEnvironments)
        {
            if (req.url?.startsWith(`/${environment.name}/`))
            {
                req.url = req.url.substring(`/${environment.name}/`.length);
                handleRequest(req, res, environment, config);
                break;
            }
        }
    });

    httpServer.on('upgrade', (req, socket: any, head: Buffer) => {
        throw 'Not implemented';
    });

    httpServer.on('error', (err) => {
        console.error(err);
    });

    httpServer.listen(80);

    // TODO: Enable this once we've figured out a way to persist helperInstanceStorage between config reloads.
    // while (true)
    // {
    //     await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    //     let newConfig = await Config.load();
    //     if (newConfig)
    //     {
    //         config = newConfig;
    //     }
    // }
}

main();
