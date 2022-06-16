# API Proxy

This is a configurable proxy that is designed to be placed between your server-side application and the third-party APIs that it consumes.

It offers the following advantages:

* Simplify your application code by offloading authentication logic.
* Reduce your attack surface by removing the need for your application to have direct access to secrets such as API keys.
* Make it easier to experiment with third-party APIs using tools such as cURL and Postman.
* Make it easier for you to observe traffic between your application and third-party APIs.
* Provide an abstraction for your application to run in multiple environments with different sets of API keys.
* Allow you to use third-party APIs in a "read only" mode where necessary to ensure the safety of a non-production deployment of your application that needs to access production third-party APIs.

## Intended use case

API Proxy is intended for cases where you have one or more server-side applications that need to access various third-party services, where you control the setup of API keys for these services.

It is not intended for applications that access services "on behalf of" an external user who sets up their own API keys for third-party services, and passes the keys to your application. For example, if your application is built on top of the Google Maps API, and you require your users to pass in their own Google Maps API Key, it would not be a good fit for API Proxy.

## Setup

### Prerequisities

API Proxy is designed to be installed into a Kubernetes cluster using Skaffold. Other deployments may be possible, but are not currently officially supported.

You will need a way of making your API credentials available to API Proxy. The Helm chart includes a parameter called `externalSecret` that can be used to specify the name of a `Secret` (which you will need to deploy into the same namespace) whose keys will be mounted into the API Proxy pod at `/externalSecrets`. For example, you could create this `Secret` using the [External Secrets](https://external-secrets.io/) operator.

### Security considerations

API Proxy does not authenticate incoming requests, it simply adds the necessary API credentials and forwards the requests to the third-party services. Therefore, it should not be exposed to untrusted users/applications.

Often it will be enough to make sure that it is not exposed outside the cluster via a `LoadBalancer`, `Ingress`, etc. But if you have untrusted code running within the cluster, you may want to impose further restrictions such as `NetworkPolicy` to prevent those applications from accessing API Proxy.

## Configuration

API Proxy can be configured via Helm values. Refer to `chart/values.yaml` for the basic template. The configuration can be broken down into the following sections:

* `apis`: Definitions of APIs and how to authenticate with them.
* `apiCredentials`: Includes one or more named credential sets for each API, and where to find each credential within the External Secrets.
* `apiEnvironmentSets`: Pulls together sets of API Credentials into "environments", e.g. dev, production, etc. There can be multiple "environment sets", each one corresponding to a different deployment of API Proxy.

### API Definitions

API Proxy needs to know how to authenticate with each of the APIs that you want to use. The goal is to make this as easy as possible for common authentication methods such as OAuth. However, a powerful system of authentication helpers is included to allow you to specify more complex or unusual authentication methods as well.

For each API, the following things need to be defined:

* `name` (string): A name that can be used to identify the API from elsewhere in the config.
* `baseURL` (`Value`): The root URL of the API. All request paths will be appended to this URL.
* `headers` (array of `Value`s): Headers that should be added to the request.
* `helpers` (array of `Helper`s): Helpers that are required to generate the `baseURL` and/or `headers` for the API.

A `Value` can have any of the following for its `type`:

* `direct`: Use the provided string value directly.
* `fromCredentials`: Get the specified value from the `apiCredentials` that are being used for this API.
* `fromHelper`: Use a specific output from a specific helper, defined in the `helpers` section.
* `fromJSONFile`: Use a value from a JSON file, e.g. from an External Secret.
* `moeJSTemplate`: Use the provided [moe-js](https://www.toptensoftware.com/moe-js/) template, which may reference credentials, helpers, etc.

A `Helper` can have any of the following for its `type`:

* `basicAuth`: Construct an HTTP Basic authorization header from the provided username and password.
* `cachedResponse`: Make a request to an endpoint, and cache the response (e.g. an access token) for a specified amount of time.
* `hmac`: Generate an HMAC hash of a message.
* `jwt`: Cache a provided JWT until it expires.
* `oAuthToken`: Perform an OAuth "get token" request to a specified endpoint, and cache the resulting token until it expires.
* `timestamp`: Get the current time as a UNIX timestamp.

### API Credentials

Each set of API Credentials has the following:

* `name` (string): A name that can be used to identify the credential set from elsewhere in the config.
* `api` (string): The name of the API that this credential set is for.
* `values` (array of `Value`s): The values of each credential.

### API Environments

Each API Environment Set consists of an array of bindings from environment names to API Credential sets. Each binding also includes a `fullAccess` Boolean which indicates whether the environment has full access, or only read-only access, to the API.

## Usage

Once API Proxy is configured, you can make a request to an API as follows:

`curl -v http://web.api-proxy/environment_name/request_path`

API Proxy will look at the first path component (`environment_name`) to determine which environment the request is for. It will then look up the corresponding API credentials and API definition for that environment, and authenticate with the API using the credentials. The request will be rewritten to:

`https://third-party-api.example.com/request_path`