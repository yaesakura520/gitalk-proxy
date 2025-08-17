const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://github.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyReq: (proxyReq) => {
      const auth = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString('base64');
      
      proxyReq.setHeader('Authorization', `Basic ${auth}`);
      proxyReq.setHeader('Accept', 'application/json');
      proxyReq.setHeader('User-Agent', 'Gitalk-Proxy-Server');
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
