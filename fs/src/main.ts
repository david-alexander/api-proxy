import './Telemetry'; // This needs to be at the top!

import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as NodeCache from 'node-cache';
import 'reflect-metadata';
import { APIEnvironment } from './config/APIEnvironment';
import { Config } from "./config/Config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const cache = new NodeCache({})

async function main()
{
    let proxy = httpProxy.createProxyServer({
        proxyTimeout: 60 * 60 * 1000,
        // ws: true
    });

    proxy.on('proxyRes', function (proxyRes, req, res) {
        if ((req as any).storeResponseBody)
        {
            proxyRes.on('data', function (chunk) {
                ((res as any).body = (res as any).body || []).push(chunk);
            });
        }
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

        let route = api.findMatchingRoute(req.url!);
        let caching = route?.caching || null;
        
        let baseURL = await api.baseURL.value.getValueAsString(context);
        let headers = await api.headers.getValues(context);

        for (let key in headers)
        {
            req.headers[key] = headers[key];
        }

        if (caching)
        {
            let cached = cache.get(req.url!) as any;

            if (cached)
            {
                res.writeHead(cached.statusCode, undefined, Object.fromEntries(
                    cached.headers
                        .filter((h: any) => ['date', 'content-length'].indexOf(h.name.toLowerCase()) == -1)
                        .map((h: any) => [h.name, h.value])
                ));
                res.end(cached.body);
                return;
            }
            else
            {
                (req as any).storeResponseBody = true;
                res.on('finish', () => {
                    cache.set(req.url!, {
                        statusCode: res.statusCode,
                        headers: Object.entries(res.getHeaders()).map(([k, v]) => ({ name: k, value: v})),
                        body: Buffer.concat((res as any).body)
                    }, caching!.ttl);
                });
            }
        }

        await environment.throttleRequest(async () => {
            let proxyOptions: any = { target: baseURL, changeOrigin: true, secure: false };

            if (process.env.HTTP_TOOLKIT_ENABLED == 'true')
            {
                proxyOptions = { target: `http://httptoolkit-proxy:8000`, headers: { host: new URL(baseURL).hostname }, secure: false, path: `${baseURL}${req.url}` };
            }

            proxy.web(req, res, proxyOptions, (err: any) => {
                console.log(err);
                if (!res.headersSent) 
                {
                    res.writeHead(502);
                }
                res.end('Bad Gateway');
            });
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
                return;
            }
        }
        res.writeHead(404);
        res.end('API proxy environment not found.');
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
