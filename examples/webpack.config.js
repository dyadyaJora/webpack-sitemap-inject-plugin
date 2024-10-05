const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const WebpackSitemapInjectPlugin = require('../index.js');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new CopyPlugin({
        patterns: [
          { from: "sitemap.xml", to: "./" }
        ],
    }),
    new WebpackSitemapInjectPlugin({
      sitemapPath: 'sitemap.xml',
      sitemapOutputPath: 'sitemap.xml',
      baseUrl: 'https://yourwebsite.com',
      routes: [
        { path: '/', priority: '1.0', changefreq: 'daily' },
        { path: '/about', priority: '0.9', changefreq: 'monthly' },
        { path: '/contact', priority: '0.9', changefreq: 'monthly' },
      ]
    }),
  ],
};
