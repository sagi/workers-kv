import https from 'https';
import querystring from 'querystring';

const workersKvDebug = require('debug')('workers-kv-debug');

export const MAX_KEYS_LIMIT = 1000;
export const MIN_KEYS_LIMIT = 10;
export const MAX_KEY_LENGTH = 512;
export const MAX_VALUE_LENGTH = 10 * 1024 * 1024;
export const MIN_EXPIRATION_TTL_SECONDS = 60;
export const MAX_MULTIPLE_KEYS_LENGTH = 10000;
export const ERROR_PREFIX = '@sagi.io/workers-kv';

export const httpsAgent = new https.Agent({ keepAlive: true });

export const httpsReq = (options, reqBody = '') =>
  new Promise((resolve, reject) => {
    options.agent = httpsAgent;
    const req = https.request(options, res => {
      const { headers } = res;
      workersKvDebug({ headers });
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => responseBodyResolver(resolve)(headers, data));
    });
    req.on('error', e => reject(e));
    !!reqBody && req.write(reqBody);
    req.end();
  });

export const responseBodyResolver = resolve => (headers, data) => {
  const contentType = headers['content-type'];
  if (contentType.includes('text/plain')) {
    resolve(data);
  } else if (contentType.includes('application/json')) {
    resolve(JSON.parse(data));
  } else if (contentType.includes('application/octet-stream')) {
    resolve(data);
  } else {
    throw new Error(
      `${ERROR_PREFIX} only JSON, octet-stream or plain text content types are expected. Received content-type: ${contentType}.`
    );
  }
};

export const removeUndefineds = obj => JSON.parse(JSON.stringify(obj));

export const getQueryString = obj =>
  querystring.stringify(removeUndefineds(obj));

export const getPathWithQueryString = (path, qs) => path + (qs ? `?${qs}` : '');

export const checkLimit = limit => {
  if (limit < MIN_KEYS_LIMIT || limit > MAX_KEYS_LIMIT) {
    throw new Error(
      `${ERROR_PREFIX}: limit should be between ${MIN_KEYS_LIMIT} and ${MAX_KEYS_LIMIT}. Given limit: ${limit}.`
    );
  }
};

export const isString = x =>
  typeof x === 'string' ||
  (x && Object.prototype.toString.call(x) === '[object String]');

export const checkKey = key => {
  if (!key || !isString(key) || key.length > MAX_KEY_LENGTH) {
    throw new Error(
      `${ERROR_PREFIX}: Key length should be less than ${MAX_KEY_LENGTH}. `
    );
  }
};

export const checkKeyValue = (key, value) => {
  checkKey(key);
  if (!value || !isString(value) || value.length > MAX_VALUE_LENGTH) {
    throw new Error(
      `${ERROR_PREFIX}: Value length should be less than ${MAX_VALUE_LENGTH}.`
    );
  }
};

export const checkMultipleKeysLength = (method, length) => {
  if (length > MAX_MULTIPLE_KEYS_LENGTH) {
    throw new Error(
      `${ERROR_PREFIX}: method ${method} must be provided a container with at most ${MAX_MULTIPLE_KEYS_LENGTH} items.`
    );
  }
};

export const checkKeyValueMap = keyValueMap => {
  const entries = keyValueMap ? Object.entries(keyValueMap) : [];
  if (!entries.length) {
    throw new Error(
      `${ERROR_PREFIX}: keyValueMap must be an object thats maps string keys to string values.`
    );
  }
  checkMultipleKeysLength('checkKeyValue', entries.length);
  entries.forEach(([k, v]) => checkKeyValue(k, v));
};

export const checkKeys = keys => {
  if (!keys || !Array.isArray(keys) || !keys.length) {
    throw new Error(
      `${ERROR_PREFIX}: keys must be an array of strings (key names).`
    );
  }
  checkMultipleKeysLength('checkKeys', keys.length);
  keys.forEach(checkKey);
};

export const getNamespaceId = (baseInputs, namespaceId) => {
  const nsId = namespaceId || baseInputs.namespaceId;
  if (!nsId) {
    throw new Error(
      `${ERROR_PREFIX}: namepspaceId wasn't provided to either WorkersKV or the specific method.`
    );
  }
  return nsId;
};

export const getAuthHeaders = (cfEmail, cfAuthKey, cfAuthToken) => {
  if (cfAuthToken) {
    return { Authorization: `Bearer ${cfAuthToken}` };
  }

  if (cfEmail && cfAuthKey) {
    return { 'X-Auth-Email': cfEmail, 'X-Auth-Key': cfAuthKey };
  }

  throw new Error(
    `${ERROR_PREFIX}: Either cfAuthToken or cfEmail and cfAuthKey must be provided`
  );
};
