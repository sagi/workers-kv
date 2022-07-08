# workers-kv

[`@sagi.io/workers-kv`](https://www.npmjs.com/package/@sagi.io/workers-kv) is a Cloudflare Workers KV API for Node.js.

⭐ We use it at **[OpenSay](https://opensay.co/s=workers-kv)** to efficiently cache data on Cloudflare Workers KV.

[![CircleCI](https://circleci.com/gh/sagi/workers-kv.svg?style=svg&circle-token=c5ae7a8993d47db9ca08a628614585ca45c75f33)](https://circleci.com/gh/sagi/workers-kv)
[![MIT License](https://img.shields.io/npm/l/@sagi.io/workers-kv.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![version](https://img.shields.io/npm/v/@sagi.io/workers-kv.svg?style=flat-square)](http://npm.im/@sagi.io/workers-kv)

## Installation

~~~
$ npm i @sagi.io/workers-kv
~~~

## Quickstart

First, instantiate a `WorkersKVREST` instance:

~~~js
const WorkersKVREST = require('@sagi.io/workers-kv')

const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const cfAuthKey = process.env.CLOUDFLARE_AUTH_KEY;
const cfEmail = process.env.CLOUDFLARE_EMAIL;

const WorkersKV = new WorkersKVREST({ cfAccountId, cfAuthKey, cfEmail })
~~~

Then, access it's instance methods. For instance:

~~~js
const namespaceId = '...'

const allKeys = await KV.listAllKeys({ namespaceId })
~~~

## API

We adhere to [Cloudflare's Workers KV REST API](https://api.cloudflare.com/#workers-kv-namespace-properties).

### **`WorkersKVREST({ ... })`**

Instantiates a `WorkersKV` object with the defined below methods.

Function definition:

```js
const WorkersKVREST = function({
  cfAccountId,
  cfEmail,
  cfAuthKey,
  namespaceId = '',
}){ ... }
```

Where:

  - **`cfAccountId`** *required* Your Cloudflare account id.
  - **`cfEmail`** *optional|required* The email you registered with Cloudflare.
  - **`cfAuthKey`** *optional|required* Your Cloudflare Auth Key.
  - **`cfAuthToken`** *optional|required* Your Cloudflare Auth Token.
  - **`namespaceId`** *optional* The `Workers KV` namespace id. This argument is *optional* - either provide it here, or via the methods below.

Use `cfAuthToken` with a [Cloudflare auth token](https://support.cloudflare.com/hc/en-us/articles/200167836-Managing-API-Tokens-and-Keys). You can also set `cfEmail` and `cfAuthKey` directly without using an auth token.

### **`WorkersKV.listKeys({ ... })`**

Function definition:

```js
const listKeys = async ({
  namespaceId = '',
  limit = MAX_KEYS_LIMIT,
  cursor = undefined,
  prefix = undefined,
} = {}) => { ... }
```

Where:

  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
  - **`limit`** *optional* The number of keys to return. The cursor attribute may be used to iterate over the next batch of keys if there are more than the limit.
  - **`cursor`** *optional* Opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* A string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

### **`WorkersKV.listAllKeys({ ... })`**

Cursors through `listKeys` requests for you.

Function definition:

```js
const listAllKeys = async ({
  namespaceId = '',
  prefix = undefined,
  limit = MAX_KEYS_LIMIT,
} = {}) => { ... }
```

Where:

  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
  - **`cursor`** *optional* Opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* A string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

### **`listNamespaces({ ... })`**

Function definition:

```js
const listNamespaces = async ({
  page = 1,
  per_page = 50,
} = {}) => { ... }
```

Where:

  - **`page`** *optional* Page number of paginated results.
  - **`per_page`** *optional* Maximum number of results per page.

### **`readKey({ ... })`**

Function definition:

```js
const readKey = async ({
  key,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`key`** *required* the key name.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).

### **`WorkersKV.deleteKey({ ... })`**

Function definition:

```js
const deleteKey= async ({
  key,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`key`** *required* the key name.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).

### **`WorkersKV.writeKey({ ... })`**

Function definition:

```js
const writeKey=> async ({
  key,
  value,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
}) => { ... }
```

Where:

  - **`key`** *required* A key's name. The name may be at most 512 bytes. All printable, non-whitespace characters are valid.
  - **`value`** *required* A UTF-8 encoded string to be stored, up to 10 MB in length.
  - **`namespaceId`** *optional* Is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* The time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* The number of seconds for which the key should be visible before it expires. At least 60.

### **`WorkersKV.writeMultipleKeys({ ... })`**

Function definition:

```js
const writeMultipleKeys => async ({
  keyValueMap,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
  base64 = false,
}) => { ... }
```

Where:

  - **`keyValueMap`** *required* Is an object with string keys and values. e.g  `{ keyName1: 'keyValue1', keyName2: 'keyValue2' }`
  - **`namespaceId`** *optional* Is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* The time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* The number of seconds for which the key should be visible before it expires. At least 60.
  - **`base64`** *optional* Whether or not the server should base64 decode the value before storing it. Useful for writing values that wouldn't otherwise be valid JSON strings, such as images. Default: false.

### **`WorkersKV.deleteMultipleKeys({ ... })`**

Function definition:

```js
const deleteMultipleKeys = async ({
  keys,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`keys`** *required* An array of keys to be deleted.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
