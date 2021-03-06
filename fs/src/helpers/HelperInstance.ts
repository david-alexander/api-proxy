import { ClassConstructor, Type } from "class-transformer";
import { BasicAuthHelper } from "./BasicAuth";
import { CachedResponseHelper } from "./CachedResponse";
import { Helper } from "./Helper";
import { HMACHelper } from "./HMAC";
import { JWTHelper } from "./JWT";
import { OAuthTokenHelper } from "./OAuthToken";
import { TimestampHelper } from "./Timestamp";

let HELPER_TYPES:{ value: ClassConstructor<Helper<unknown>>, name: string }[] = [
    { value: BasicAuthHelper, name: 'basicAuth' },
    { value: HMACHelper, name: 'hmac' },
    { value: TimestampHelper, name: 'timestamp' },
    { value: OAuthTokenHelper, name: 'oauthToken' },
    { value: JWTHelper, name: 'jwt' },
    { value: CachedResponseHelper, name: 'cachedResponse' }
];

export class HelperInstance
{
    @Type(() => String)
    name!: string;

    @Type(() => Helper, {
        discriminator: {
          property: 'type',
          subTypes: HELPER_TYPES,
        },
      })
    helper!: Helper<unknown>;
}
