import { Type } from "class-transformer";
const { routeMatcher } = require('route-matcher');

export class APIRouteCaching
{
    @Type(() => Number)
    ttl!: number;
}

export class APIRoute
{
    @Type(() => String)
    route!: string;

    @Type(() => APIRouteCaching)
    caching: APIRouteCaching | null = null;

    matches(path: string)
    {
        return routeMatcher(path) != null;
    }
}
