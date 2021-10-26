import { ClassConstructor, Type } from "class-transformer";
import { BasicAuthHelper } from "./BasicAuth";
import { Helper } from "./Helper";
import { HMACHelper } from "./HMAC";
import { OAuthTokenHelper } from "./OAuthToken";
import { TimestampHelper } from "./Timestamp";

let HELPER_TYPES:{ value: ClassConstructor<Helper<unknown>>, name: string }[] = [
    { value: BasicAuthHelper, name: 'basicAuth' },
    { value: HMACHelper, name: 'hmac' },
    { value: TimestampHelper, name: 'timestamp' },
    { value: OAuthTokenHelper, name: 'oauthToken' }
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
