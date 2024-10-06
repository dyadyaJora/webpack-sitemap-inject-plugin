# webpack-sitemap-inject-plugin

[![NPM Version](https://img.shields.io/npm/v/webpack-sitemap-inject-plugin)](https://www.npmjs.com/package/webpack-sitemap-inject-plugin)
[![Node.js Package](https://github.com/dyadyaJora/webpack-sitemap-inject-plugin/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/dyadyaJora/webpack-sitemap-inject-plugin/actions/workflows/npm-publish.yml)
## Intro

One more webpack plugin for postprocessing of yours `sitemap.xml` file. Allows to add custom elements to already existing `sitemap.xml` over webpack.

## Installation

    npm install --save-dev webpack-sitemap-inject-plugin

## How to use

In your `webpack.config.js` you should add `WebpackSitemapInjectPlugin` definition with required options:

```js
const WebpackSitemapInjectPlugin = require("webpack-sitemap-inject-plugin");

module.exports = {
  // ....
  plugins: [
    //...
    new WebpackSitemapInjectPlugin({
      sitemapPath: 'sitemap.xml', // Path to input sitemap.xml in your outputs
      sitemapOutputPath: 'sitemap.xml', // Path to input sitemap.xml (overrides existing input by default)
      baseUrl: 'https://yourwebsite.com', // your site base url
      fillTimestamps: true, // enable automatically fill `lastmod` tag with current timestamp
      routes: [
        { path: '/', priority: '1.0', changefreq: 'daily' },
        { path: '/about', priority: '0.9', changefreq: 'monthly' },
        { path: '/contact', priority: '0.9', changefreq: 'monthly' },
      ]
    }),
  ],
};

```

See full example in [examples/webpack.config.js](https://github.com/dyadyaJora/webpack-sitemap-inject-plugin/blob/main/examples/webpack.config.js) folder
