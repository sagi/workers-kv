import {
  httpsReq,
  checkKey,
  checkKeys,
  checkLimit,
  checkKeyValue,
  getNamespaceId,
  getQueryString,
  checkKeyValueMap,
  getPathWithQueryString,
  MAX_KEYS_LIMIT,
} from './utils';

export const listKeys = baseInputs => async ({
  namespaceId = '',
  limit = MAX_KEYS_LIMIT,
  cursor = undefined,
  prefix = undefined,
} = {}) => {
  checkLimit(limit);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const qs = getQueryString({ limit, cursor, prefix });
  const path = getPathWithQueryString(`${basePath}/${nsId}/keys`, qs);
  const method = 'GET';
  const options = { method, host, path, headers };

  return httpsReq(options);
};

export const listAllKeys = baseInputs => async ({
  namespaceId = '',
  prefix = undefined,
  limit = MAX_KEYS_LIMIT,
} = {}) => {
  checkLimit(limit);

  const results = [];
  let result_info = null;
  let cursor = '';

  do {
    const data = await exports.listKeys(baseInputs)({
      limit,
      namespaceId,
      prefix,
      cursor,
    });
    const { success, result } = data;

    success && result.forEach(x => results.push(x));

    ({ result_info } = data);
    ({ cursor } = result_info);
  } while (result_info && result_info.cursor);

  return {
    success: true,
    result: results,
    result_info: { count: results.length },
  };
};

export const listNamespaces = baseInputs => async ({
  page = 1,
  per_page = 50,
} = {}) => {
  const { host, basePath, headers } = baseInputs;
  const qs = getQueryString({ page, per_page });
  const path = getPathWithQueryString(basePath, qs);
  const method = 'GET';
  const options = { method, host, path, headers };

  return httpsReq(options);
};

export const writeKey = baseInputs => async ({
  key,
  value,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
}) => {
  checkKeyValue(key, value);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const qs = getQueryString({ expiration, expiration_ttl });
  const keyPath = `${basePath}/${nsId}/values/${key}`;
  const path = getPathWithQueryString(keyPath, qs);
  const method = 'PUT';
  const putHeaders = {
    ...headers,
    'Content-Type': 'text/plain',
    'Content-Length': value.length,
  };

  const options = { method, host, path, headers: putHeaders };

  return httpsReq(options, value);
};

export const readKey = baseInputs => async ({ key, namespaceId = '' }) => {
  checkKey(key);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const path = `${basePath}/${nsId}/values/${key}`;
  const method = 'GET';
  const options = { method, host, path, headers };

  return httpsReq(options);
};

export const deleteKey = baseInputs => async ({ key, namespaceId = '' }) => {
  checkKey(key);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const path = `${basePath}/${nsId}/values/${key}`;
  const method = 'DELETE';
  const options = { method, host, path, headers };

  return httpsReq(options);
};

export const writeMultipleKeys = baseInputs => async ({
  keyValueMap,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
  base64 = false,
}) => {
  checkKeyValueMap(keyValueMap);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const qs = getQueryString({ expiration, expiration_ttl });
  const bulkPath = `${basePath}/${nsId}/bulk`;
  const path = getPathWithQueryString(bulkPath, qs);
  const method = 'PUT';

  const bodyArray = Object.entries(keyValueMap).map(([key, value]) => ({
    key,
    value,
    base64,
  }));

  const body = JSON.stringify(bodyArray);
  const putHeaders = {
    ...headers,
    'Content-Type': 'application/json',
    'Content-Length': body.length,
  };

  const options = { method, host, path, headers: putHeaders };
  return httpsReq(options, body);
};

export const deleteMultipleKeys = baseInputs => async ({
  keys,
  namespaceId = '',
}) => {
  checkKeys(keys);
  const { host, basePath, headers } = baseInputs;
  const nsId = getNamespaceId(baseInputs, namespaceId);

  const path = `${basePath}/${nsId}/bulk`;
  const method = 'DELETE';
  const body = JSON.stringify(keys);
  const deleteHeaders = {
    ...headers,
    'Content-Type': 'application/json',
    'Content-Length': body.length,
  };
  const options = { method, host, path, headers: deleteHeaders };

  return httpsReq(options, body);
};

export const METHODS = {
  listKeys,
  listAllKeys,
  readKey,
  writeKey,
  writeMultipleKeys,
  deleteKey,
  deleteMultipleKeys,
  listNamespaces,
};
