import * as methods from './methods';
import * as utils from './utils';

describe('methods', () => {
  utils.httpsReq = jest.fn();
  const cfAccountId = 'cf_account_id';
  const namespaceId = 'namespace_id';
  const cfAuthKey = 'cf_auth_key';
  const cfEmail = 'cf_email';
  const host = 'api.cloudflare.com';
  const basePath = `/client/v4/accounts/${cfAccountId}/storage/kv/namespaces`;

  const headers = {
    'X-Auth-Email': cfEmail,
    'X-Auth-Key': cfAuthKey,
  };
  const baseInputs = { host, basePath, namespaceId, headers };
  const baseInputsWithoutNamespaceId = {
    host,
    basePath,
    namespaceId: '',
    headers,
  };

  beforeEach(() => {
    utils.httpsReq.mockClear();
  });

  test('listKeys', () => {
    methods.listKeys(baseInputs)({ limit: 123, prefix: 'prod_' });
    const expectedOptions1 = {
      headers: { 'X-Auth-Email': 'cf_email', 'X-Auth-Key': 'cf_auth_key' },
      host: 'api.cloudflare.com',
      method: 'GET',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/keys?limit=123&prefix=prod_',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1);

    utils.httpsReq.mockClear();

    methods.listKeys(baseInputsWithoutNamespaceId)({
      namespaceId: 'namespace_id_123',
      limit: 123,
      prefix: 'prod_',
    });
    const expectedOptions2 = {
      headers: { 'X-Auth-Email': 'cf_email', 'X-Auth-Key': 'cf_auth_key' },
      host: 'api.cloudflare.com',
      method: 'GET',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id_123/keys?limit=123&prefix=prod_',
    };

    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions2);
  });

  test('listAllKeys', async () => {
    const listKeysSpy = jest.spyOn(methods, 'listKeys');

    const retVal1 = jest.fn(() => ({
      success: true,
      result: ['prod_x', 'prod_y'],
      result_info: { cursor: 'xyz' },
    }));

    const retVal2 = jest.fn(() => ({
      success: true,
      result: ['prod_z', 'prod_t'],
      result_info: { cursor: '' },
    }));

    listKeysSpy.mockReturnValueOnce(retVal1);
    listKeysSpy.mockReturnValueOnce(retVal2);

    const expected = {
      result: ['prod_x', 'prod_y', 'prod_z', 'prod_t'],
      result_info: {
        count: 4,
      },
      success: true,
    };
    await expect(
      methods.listAllKeys(baseInputs)({ prefix: 'prod_' })
    ).resolves.toEqual(expected);
  });

  test('listNamespaces', () => {
    methods.listNamespaces(baseInputs)({ page: 1, per_page: '17' });
    const expectedOptions1 = {
      headers: { 'X-Auth-Email': 'cf_email', 'X-Auth-Key': 'cf_auth_key' },
      host: 'api.cloudflare.com',
      method: 'GET',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces?page=1&per_page=17',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1);
  });

  test('writeKey', () => {
    const key = 'xKey';
    const value = 'xValue';
    methods.writeKey(baseInputs)({
      key,
      value,
      expiration_ttl: 123,
    });
    const expectedOptions1 = {
      headers: {
        'Content-Length': 6,
        'Content-Type': 'text/plain',
        'X-Auth-Email': 'cf_email',
        'X-Auth-Key': 'cf_auth_key',
      },
      host: 'api.cloudflare.com',
      method: 'PUT',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/values/xKey?expiration_ttl=123',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1, value);
  });

  test('readKey', () => {
    const key = 'xKey';
    methods.readKey(baseInputs)({ key });
    const expectedOptions1 = {
      headers: { 'X-Auth-Email': 'cf_email', 'X-Auth-Key': 'cf_auth_key' },
      host: 'api.cloudflare.com',
      method: 'GET',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/values/xKey',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1);
  });

  test('deleteKey', () => {
    const key = 'xKey';
    methods.deleteKey(baseInputs)({ key });
    const expectedOptions1 = {
      headers: { 'X-Auth-Email': 'cf_email', 'X-Auth-Key': 'cf_auth_key' },
      host: 'api.cloudflare.com',
      method: 'DELETE',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/values/xKey',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1);
  });

  test('deleteMultipleKeys', () => {
    const keys = ['key1', 'key2'];
    methods.deleteMultipleKeys(baseInputs)({ keys });
    const expectedOptions1 = {
      headers: {
        'Content-Length': 15,
        'Content-Type': 'application/json',
        'X-Auth-Email': 'cf_email',
        'X-Auth-Key': 'cf_auth_key',
      },
      host: 'api.cloudflare.com',
      method: 'DELETE',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/bulk',
    };
    expect(utils.httpsReq).toHaveBeenCalledWith(
      expectedOptions1,
      JSON.stringify(keys)
    );
  });

  test('writeMultipleKeys', () => {
    const base64 = true;
    const keyValueMap = { key1: 'value1', key2: 'value2' };
    methods.writeMultipleKeys(baseInputs)({
      keyValueMap,
      expiration_ttl: 123,
      base64,
    });
    const body = JSON.stringify([
      { key: 'key1', value: 'value1', base64 },
      { key: 'key2', value: 'value2', base64 },
    ]);
    const expectedOptions1 = {
      headers: {
        'Content-Length': body.length,
        'Content-Type': 'application/json',
        'X-Auth-Email': 'cf_email',
        'X-Auth-Key': 'cf_auth_key',
      },
      host: 'api.cloudflare.com',
      method: 'PUT',
      path:
        '/client/v4/accounts/cf_account_id/storage/kv/namespaces/namespace_id/bulk?expiration_ttl=123',
    };

    expect(utils.httpsReq).toHaveBeenCalledWith(expectedOptions1, body);
  });
});
