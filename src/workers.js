import { METHODS } from './methods';
import { getAuthHeaders } from './utils';

const WorkersKVREST = function({
  cfAccountId,
  cfEmail = null,
  cfAuthKey = null,
  cfAuthToken = null,
  namespaceId = '',
}) {
  const host = 'api.cloudflare.com';
  const basePath = `/client/v4/accounts/${cfAccountId}/storage/kv/namespaces`;
  const headers = getAuthHeaders(cfEmail, cfAuthKey, cfAuthToken);

  const baseInputs = { host, basePath, namespaceId, headers };

  const API = {};
  Object.entries(METHODS).forEach(([name, fn]) => (API[name] = fn(baseInputs)));
  return API;
};

export default WorkersKVREST;
