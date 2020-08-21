import * as utils from './utils';
import https from 'https';
import EventEmitter from 'events';

jest.mock('https');

describe('utils', () => {
  test('httpsReq', async () => {
    const req = new EventEmitter();
    req.write = jest.fn();
    req.end = jest.fn();
    https.request.mockReturnValueOnce(req);

    const options = { host: 'sagi.io', path: '/api.php' };
    const body = 'abcdefg';
    const p1 = utils.httpsReq(options, body);
    req.emit('error', 'errmsg');
    await expect(p1).rejects.toEqual('errmsg');

    https.request.mockClear();
    https.request.mockReturnValueOnce(req);

    const p2 = utils.httpsReq(options, body);

    const reqCallback = https.request.mock.calls[0][1];
    const res = new EventEmitter();
    res.headers = { 'content-type': 'application/json' };
    reqCallback(res);
    const data = '{"a":1234}';
    res.emit('data', data);
    res.emit('end');
    await expect(p2).resolves.toEqual({ a: 1234 });

    expect(https.request).toHaveBeenCalledWith(options, expect.any(Function));
  });

  test('responseBodyResolver', () => {
    const resolve1 = jest.fn();
    const headers1 = { 'content-type': 'text/plain' };
    const data1 = 'abcdefg';
    utils.responseBodyResolver(resolve1)(headers1, data1);
    expect(resolve1).toHaveBeenCalledWith(data1);

    const resolve2 = jest.fn();
    const headers2 = { 'content-type': 'application/json' };
    const data2 = '{ "a": 1234 }';
    utils.responseBodyResolver(resolve2)(headers2, data2);
    expect(resolve2).toHaveBeenCalledWith(JSON.parse(data2));

    const contentType = 'application/bla';
    const headers3 = { 'content-type': contentType };
    const data3 = 'ZIP..blaaaaa';
    expect(() => utils.responseBodyResolver(resolve2)(headers3, data3)).toThrow(
      `${
        utils.ERROR_PREFIX
      } only JSON, octet-stream or plain text content types are expected. Received content-type: ${contentType}.`
    );

    const resolve4 = jest.fn();
    const headers4 = { 'content-type': 'application/octet-stream' };
    const data4 = '{ "a": 1234 }';
    utils.responseBodyResolver(resolve4)(headers4, data4);
    expect(resolve4).toHaveBeenCalledWith(data4);
  });

  test('removeUndefineds', () => {
    const obj = { a: 'b', c: undefined };
    expect(utils.removeUndefineds(obj)).toEqual({ a: 'b' });
  });

  test('getQueryString', () => {
    const obj = { limit: 1000, cursor: undefined, prefix: 'prod_' };
    expect(utils.getQueryString(obj)).toEqual('limit=1000&prefix=prod_');
  });

  test('getPathWithQueryString', () => {
    const path = '/api/bla.php';
    const qs1 = 'limit=123&prefix=dev_';
    expect(utils.getPathWithQueryString(path, qs1)).toEqual(`${path}?${qs1}`);
    const qs2 = '';
    expect(utils.getPathWithQueryString(path, qs2)).toEqual(path);
  });

  test('checkLimit', () => {
    const limit1 = 9;
    expect(() => utils.checkLimit(limit1)).toThrow(
      `${utils.ERROR_PREFIX}: limit should be between ${
        utils.MIN_KEYS_LIMIT
      } and ${utils.MAX_KEYS_LIMIT}. Given limit: ${limit1}.`
    );
    const limit2 = 1001;
    expect(() => utils.checkLimit(limit2)).toThrow(
      `${utils.ERROR_PREFIX}: limit should be between ${
        utils.MIN_KEYS_LIMIT
      } and ${utils.MAX_KEYS_LIMIT}. Given limit: ${limit2}.`
    );
  });

  test('isString', () => {
    const s1 = 123;
    expect(utils.isString(s1)).toBe(false);
    const s2 = 'abcde';
    expect(utils.isString(s2)).toBe(true);
  });

  test('checkKey', () => {
    const k1 = null;
    expect(() => utils.checkKey(k1)).toThrow(
      `${utils.ERROR_PREFIX}: Key length should be less than ${
        utils.MAX_KEY_LENGTH
      }`
    );
    const k2 = '';
    expect(() => utils.checkKey(k2)).toThrow(
      `${utils.ERROR_PREFIX}: Key length should be less than ${
        utils.MAX_KEY_LENGTH
      }`
    );
  });

  test('checkKeyValue', () => {
    const key1 = 'abcd';
    const value1 = null;
    expect(() => utils.checkKeyValue(key1, value1)).toThrow(
      `${utils.ERROR_PREFIX}: Value length should be less than ${
        utils.MAX_VALUE_LENGTH
      }.`
    );

    const key2 = '';
    const value2 = 'bla';
    expect(() => utils.checkKeyValue(key2, value2)).toThrow(
      `${utils.ERROR_PREFIX}: Key length should be less than ${
        utils.MAX_KEY_LENGTH
      }`
    );
    const key3 = 'key';
    const value3 = 'value';
    expect(() => utils.checkKeyValue(key3, value3)).not.toThrow();
  });

  test('checkKeyValueMap', () => {
    const keyValueMap1 = {};
    expect(() => utils.checkKeyValueMap(keyValueMap1)).toThrow(
      `${
        utils.ERROR_PREFIX
      }: keyValueMap must be an object thats maps string keys to string values.`
    );
    const keyValueMap2 = { key1: 'value1' };
    expect(() => utils.checkKeyValueMap(keyValueMap2)).not.toThrow();
  });

  test('checkMultipleKeysLength', () => {
    const method = 'xyz';
    const length1 = utils.MAX_MULTIPLE_KEYS_LENGTH + 1;
    expect(() => utils.checkMultipleKeysLength(method, length1)).toThrow(
      `${
        utils.ERROR_PREFIX
      }: method ${method} must be provided a container with at most ${
        utils.MAX_MULTIPLE_KEYS_LENGTH
      } items.`
    );
    const length2 = utils.MAX_MULTIPLE_KEYS_LENGTH + -1;
    expect(() => utils.checkMultipleKeysLength(method, length2)).not.toThrow();
  });

  test('checkKeys', () => {
    const keys1 = [];
    expect(() => utils.checkKeys(keys1)).toThrow(
      `${utils.ERROR_PREFIX}: keys must be an array of strings (key names).`
    );
    const keys2 = ['the', 'next', 'one', 'is', 'bad ->', ''];
    expect(() => utils.checkKeys(keys2)).toThrow(
      `${utils.ERROR_PREFIX}: Key length should be less than ${
        utils.MAX_KEY_LENGTH
      }`
    );
    const keys3 = new Array(utils.MAX_MULTIPLE_KEYS_LENGTH + 1).fill('abcde');
    expect(() => utils.checkKeys(keys3)).toThrow(
      `${
        utils.ERROR_PREFIX
      }: method checkKeys must be provided a container with at most ${
        utils.MAX_MULTIPLE_KEYS_LENGTH
      } items.`
    );

    const keys4 = ['all', 'good', 'in', 'the', 'hood'];
    expect(() => utils.checkKeys(keys4)).not.toThrow();
  });

  test('getNamespaceId', () => {
    const baseInputs1 = { namespaceId: '' };
    const namespaceId1 = '';
    expect(() => utils.getNamespaceId(baseInputs1, namespaceId1)).toThrow(
      `${
        utils.ERROR_PREFIX
      }: namepspaceId wasn't provided to either WorkersKV or the specific method.`
    );

    const baseInputs2 = { namespaceId: '' };
    const namespaceId2 = 'asdf';
    expect(utils.getNamespaceId(baseInputs2, namespaceId2)).toEqual('asdf');

    const baseInputs3 = { namespaceId: 'abcd' };
    const namespaceId3 = '';
    expect(utils.getNamespaceId(baseInputs3, namespaceId3)).toEqual('abcd');
  });

  test('getAuthHeaders', () => {
    expect(() => utils.getAuthHeaders(null, null, null)).toThrow();
    expect(() => utils.getAuthHeaders('sagi@sagi.io', null, null)).toThrow();
    expect(utils.getAuthHeaders('sagi@sagi.io', 'DEADBEEF', null)).toEqual({
      'X-Auth-Email': 'sagi@sagi.io',
      'X-Auth-Key': 'DEADBEEF',
    });
    expect(utils.getAuthHeaders(null, null, 'CAFEBABE')).toEqual({
      Authorization: 'Bearer CAFEBABE',
    });
  });
});
