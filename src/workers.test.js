import * as methods from './methods';
import WorkersKV from './workers';

describe('workers', () => {
  test('WorkersKV', () => {
    const cfMethod = jest.fn(() => () => {});
    methods.METHODS = { cfMethod };

    const cfAccountId = '1234';
    const cfEmail = 'bla@gmail.com';
    const cfAuthKey = 'abcd';
    const namespaceId = 'bla_id';

    const retVal = WorkersKV({ cfAccountId, cfEmail, cfAuthKey, namespaceId });

    const expected = {
      basePath: '/client/v4/accounts/1234/storage/kv/namespaces',
      headers: { 'X-Auth-Email': 'bla@gmail.com', 'X-Auth-Key': 'abcd' },
      host: 'api.cloudflare.com',
      namespaceId: 'bla_id',
    };
    expect(cfMethod).toHaveBeenCalledWith(expected);

    expect(retVal).toEqual({ cfMethod: expect.any(Function) });
  });
});
