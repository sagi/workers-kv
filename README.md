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

const allKeys = await KV.listAllKeys({ namespaceId })
~~~

## API

We try to adhere to [Cloudflare's Workers KV REST API](https://api.cloudflare.com/#workers-kv-namespace-properties)

### **`WorkersKV({ ... })`**

Instantiates a `WorkersKV` object with the defined below methods.

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

  - **`cfAccountId`** *required* is your Cloudflare account id.
  - **`cfEmail`** *required* is the email you registered with Cloudflare.
  - **`cfAuthKey`** *required* is your Cloudflare Auth Key.
  - **`namespaceId`** *optional* is the `Workers KV` namespace id. This argument is *optional* - either provide it here, or via the methods below.

### **`listKeys({ ... })`**

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

  - **`namespaceId`** *optional* is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`limit`** *optional* The number of keys to return. The cursor attribute may be used to iterate over the next batch of keys if there are more than the limit.
  - **`cursor`** *optional* opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* a string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

### **`listAllKeys({ ... })`**

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

  - **`namespaceId`** *optional* is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`cursor`** *optional* opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* a string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

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
  - **`namespaceId`** *optional* is the namespace id (can also be provided while instantiating `WorkersKV`).

### **`deleteKey({ ... })`**

Function definition:

```js
const deleteKey= async ({
  key,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`key`** *required* the key name.
  - **`namespaceId`** *optional* is the namespace id (can also be provided while instantiating `WorkersKV`).

### **`writeKey({ ... })`**

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
  - **`value`** *required* A UTF-8 encoded string to be stored, up to 2 MB in length.
  - **`namespaceId`** *optional* Is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* The time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* The number of seconds for which the key should be visible before it expires. At least 60.
### **`writeMultipleKeys({ ... })`**

Function definition:

```js
const writeMultipleKeys => async ({
  keyValueMap,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
}) => { ... }
```

Where:

  - **`keyValueMap`** *required* is an object with string keys and values. e.g  `{ keyName1: 'keyValue1', keyName2: 'keyValue2' }`
  - **`namespaceId`** *optional* is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* the time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* the number of seconds for which the key should be visible before it expires. At least 60.
