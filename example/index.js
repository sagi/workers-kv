const WorkersKV = require('../');

(async () => {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfAuthKey = process.env.CLOUDFLARE_AUTH_KEY;
  const cfEmail = process.env.CLOUDFLARE_EMAIL;

  const KV = new WorkersKV({
    cfAccountId,
    cfAuthKey,
    cfEmail,
  });

  const namespaceId = process.env.CLOUDFLARE_NAMESPACE_ID;
  const results = await KV.listKeys({ namespaceId });

  console.log(results);
})();
