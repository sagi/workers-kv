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

  - **`cfAccountId`** is your Cloudflare account id.
  - **`cfEmail`** is the email you registered with Cloudflare.
  - **`cfAuthKey`** is your Cloudflare Auth Key.
  - **`namespaceId`** is the `Workers KV` namespace id. This argument is *optional* - either provide it here, or via the methods below.

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

  - **`namespaceId`** is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`limit`** is the number of keys you'd like to list (lexicographic ordering).
  - **`cursor`** if your query has more keys than the provided `limit`, Cloudflare will send a cursor to send with your next query.
  - **`prefix`** allows your to retrieve all keys that begins with it (e.g. "prod_" ).

### **`listAllKeys({ ... })`**

Cursors through `listKeys` requests for you.

Function definition:

```js
const listKeys = async ({
  namespaceId = '',
  prefix = undefined,
  limit = MAX_KEYS_LIMIT,
} = {}) => { ... }
```

Where:

  - **`namespaceId`** is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`cursor`** if your query has more keys than the provided `limit`, Cloudflare will send a cursor to send with your next query.
  - **`prefix`** allows your to retrieve all keys that begins with it (e.g. "prod_" ).

### **`listNamespaces({ ... })`**

Function definition:

```js
const listNamespaces = baseInputs => async ({
  page = 1,
  per_page = 50,
} = {}) => { ... }
```

Where:

  - **`page`** *optional* the namespaces page (for paging).
  - **`per_page`** *optional* the number of namespaces per page.
