const withLess = require('@zeit/next-less');

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  env: {
    apiConfig: {
      'Client-ID': '268',
      'Client-Secret': 'e)NCZFvjM#;l5Kx',
    },
    mailgunConfig: {
      hostname: process.env.hostname,
      port: process.env.port,
      username: process.env.username,
      api_key: process.env.api_key,
      domain: process.env.domain, //'sandboxedeccbb882744c86823e8726794ae5f9.mailgun.org'
    },
  },
});
