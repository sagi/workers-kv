import { METHODS } from './methods';

const WorkersKVREST = function({
  cfAccountId,
  cfEmail,
  cfAuthKey,
  namespaceId = '',
}) {
  const host = 'api.cloudflare.com';
  const basePath = `/client/v4/accounts/${cfAccountId}/storage/kv/namespaces`;

  const headers = {
    'X-Auth-Email': cfEmail,
    'X-Auth-Key': cfAuthKey,
  };
  const baseInputs = { host, basePath, namespaceId, headers };

  const API = {};
  Object.entries(METHODS).forEach(([name, fn]) => (API[name] = fn(baseInputs)));
  return API;
};

export default WorkersKVREST;
