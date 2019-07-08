# workers-kv

[`@sagi.io/workers-kv`](https://www.npmjs.com/package/@sagi.io/workers-kv) is a Cloudflare Workers KV API for Node.js.

[![CircleCI](https://circleci.com/gh/sagi/workers-kv.svg?style=svg&circle-token=c5ae7a8993d47db9ca08a628614585ca45c75f33)](https://circleci.com/gh/sagi/workers-kv)
[![MIT License](https://img.shields.io/npm/l/@sagi.io/workers-kv.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![version](https://img.shields.io/npm/v/@sagi.io/workers-kv.svg?style=flat-square)](http://npm.im/@sagi.io/workers-kv)

## Installation

~~~
$ npm i @sagi.io/workers-kv
~~~

## WorkersKV Instance


~~~js
const WorkersKV = require('@sagi.io/workers-kv')

const KV = new WorkersKV({})
~~~

### **`getToken({ ... })`**

Function definition:

```js
const getToken = async ({
  privateKeyPEM,
  payload,
  alg = 'RS256',
  cryptoImppl = null,
  headerAdditions = {},
}) => { ... }
```

Where:

  - **`privateKeyPEM`** is the private key `string` in `PEM` format.
  - **`payload`** is the `JSON` payload to be signed, i.e. the `{ aud, iat, exp, iss, sub, scope, ... }`.
  - **`alg`** is the signing algorithm as defined in [`RFC7518`](https://tools.ietf.org/html/rfc7518#section-3.1), currently only `RS256` is supported.
  - **`cryptoImpl`** is a `WebCrypto` `API` implementation. Cloudflare Workers support `WebCrypto` out of the box. For `Node.js` you can use [`node-webcrypto-ossl`](https://github.com/PeculiarVentures/node-webcrypto-ossl) - see examples below and in the tests.
  - **`headerAdditions`** is an object with keys and string values to be added to the header of the `JWT`.

### **`getTokenFromGCPServiceAccount({ ... })`**

Function definition:

```js
const getTokenFromGCPServiceAccount = async ({
  serviceAccountJSON,
  aud,
  alg = 'RS256',
  cryptoImppl = null,
  expiredAfter = 3600,
  headerAdditions = {},
  payloadAdditions = {}
}) => { ... }
```

Where:

  - **`serviceAccountJSON`** is the service account `JSON` object .
  - **`aud`** is the audience field in the `JWT`'s payload. e.g. `https://www.googleapis.com/oauth2/v4/token`'.
  - **`expiredAfter`** - the duration of the token's validity. Defaults to 1 hour - 3600 seconds.
  - **`payloadAdditions`** is an object with keys and string values to be added to the payload of the `JWT`. Example - `{ scope: 'https://www.googleapis.com/auth/chat.bot' }`.
  - **`alg`**, **`cryptoImpl`**, **`headerAdditions`** are defined as above.


## Example

Suppose you'd like to use `Firestore`'s REST API. The first step is to generate
a service account with the "Cloud Datastore User" role. Please download the
service account and store its contents in the `SERVICE_ACCOUNT_JSON_STR` environment
variable.

The `aud` is defined by GCP's [service definitions](https://github.com/googleapis/googleapis/tree/master/google)
and is simply the following concatenated string: `'https://' + SERVICE_NAME + '/' + API__NAME`.
More info [here](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#jwt-auth).

For `Firestore` the `aud` is `https://firestore.googleapis.com/google.firestore.v1.Firestore`.

## Cloudflare Workers Usage

Cloudflare Workers expose the `crypto` global for the `Web Crypto API`.

~~~js
const { getTokenFromGCPServiceAccount } = require('@sagi.io/cfw-jwt')

const serviceAccountJSON = await ENVIRONMENT.get('SERVICE_ACCOUNT_JSON','json')
const aud = `https://firestore.googleapis.com/google.firestore.v1.Firestore`

const token = await getTokenFromGCPServiceAccount({ serviceAccountJSON, aud} )

const headers = { Authorization: `Bearer ${token}` }

const projectId = 'example-project'
const collection = 'exampleCol'
const document = 'exampleDoc'

const docUrl =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
  + `/${collection}/${document}`

const response = await fetch(docUrl, { headers })

const documentObj =  await response.json()
~~~

## Node Usage

We use the `node-webcrypto-ossl` package to imitate the `Web Crypto API` in Node.

~~~js
const WebCrypto = require('node-webcrypto-ossl');
const crypto = new WebCrypto();
const { getTokenFromGCPServiceAccount } = require('@sagi.io/cfw-jwt')

const serviceAccountJSON = { ... }
const aud = `https://firestore.googleapis.com/google.firestore.v1.Firestore`

const token = await getTokenFromGCPServiceAccount({ serviceAccountJSON, aud, cryptoImpl: crypto} )

<... SAME AS CLOUDFLARE WORKERS ...>
~~~
