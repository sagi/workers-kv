module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['jest'],
  globals: {
    process: true,
    console: true,
    module: true,
    Promise: true,
    exports: true,
    Buffer: true,
    globalThis: true,
    fetch: true,
    URLSearchParams: true,
    URL: true,
    Response: true,
    ANONYMITY_BOT: true,
    addEventListener: true,
  },
  env: {
    'jest/globals': true,
  },
};
