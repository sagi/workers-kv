# workers-kv

[`@sagi.io/workers-kv`](https://www.npmjs.com/package/@sagi.io/workers-kv) is a Cloudflare Workers KV API for Node.js.

[![CircleCI](https://circleci.com/gh/sagi/workers-kv.svg?style=svg&circle-token=c5ae7a8993d47db9ca08a628614585ca45c75f33)](https://circleci.com/gh/sagi/workers-kv)
[![MIT License](https://img.shields.io/npm/l/@sagi.io/workers-kv.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![version](https://img.shields.io/npm/v/@sagi.io/workers-kv.svg?style=flat-square)](http://npm.im/@sagi.io/workers-kv)

## Installation

~~~
$ npm i @sagi.io/workers-kv
~~~

## Quickstart

First, instantiate a `WorkersKV` instance:

~~~js
const WorkersKV = require('@sagi.io/workers-kv')
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfAuthKey = process.env.CLOUDFLARE_AUTH_KEY;
  const cfEmail = process.env.CLOUDFLARE_EMAIL;

  const KV = new WorkersKV({ cfAccountId, cfAuthKey, cfEmail })
~~~

Then, access it's instance methods. For instance:

~~~js
const namespaceId = '...'

const allKeys = await KV.listAllKeys({namespaceId})
~~~

## API

### **`WorkersKV({ ... })`**

Function definition:

```js
const WorkersKV = function({
  cfAccountId,
  cfEmail,
  cfAuthKey,
  namespaceId = '',
}){ ... }
```

Where:

  - **`cfAccountId`** is your Cloudflare account id.
  - **`cfEmail`** is the email you registered with Cloudflare.
  - **`cfAuthKey`** is your Cloudflare Auth Key.
  - **`namespaceId`** is the `Workers KV` namespace id. This argument is *optional* - either provide it here, or via the methods below.

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
