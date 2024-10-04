const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

class WebpackSitemapInjectPlugin {
  constructor(options = {}) {
    this.sitemapPath = options.sitemapPath || 'sitemap.xml';
    this.sitemapOutputPath = options.sitemapOutputPath || 'sitemap.xml';
    this.baseUrl = options.baseUrl || 'https://example.com';
    this.routes = options.routes || [];
    this.dynamicRoutes = options.dynamicRoutes || {};
    this.tabSize = options.tabSize || 2;
    this.fillTimestamp = options.fillTimestamp || true;
    this.timestamp = new Date().toISOString();
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('WebpackSitemapInjectPlugin', (compilation, callback) => {
      const outputPath = path.resolve(compiler.options.output.path);
      const sitemapFilePath = path.join(outputPath, this.sitemapPath);
      const sitemapOutputFilePath = path.join(outputPath, this.sitemapOutputPath);

      if (!fs.existsSync(sitemapFilePath)) {
        console.error(`Sitemap not found at ${sitemapFilePath}`);
        return callback();
      }

      const sitemapContent = fs.readFileSync(sitemapFilePath, 'utf-8');

      xml2js.parseString(sitemapContent, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          return callback();
        }

        const urlset = result.urlset.url || [];
        const existingLocs = new Set(urlset.map(url => url.loc[0]));

        this._updateExistingSitemapEntries(urlset, this.routes, existingLocs);
        const newRoutes = this._generateSitemapEntries(this.routes, existingLocs);

        result.urlset.url = [...urlset, ...newRoutes];

        const builder = new xml2js.Builder({ headless: true, renderOpts: { pretty: true, indent: ' '.repeat(this.tabSize) } });
        const updatedSitemapContent = builder.buildObject(result);

        fs.writeFileSync(sitemapOutputFilePath, updatedSitemapContent);

        console.log(`Routes successfully injected into ${this.sitemapPath}`);
        callback();
      });
    });
  }

  /**
   * Generate sitemap XML entries for each route if not already present
   * @param {*} routes 
   * @param {Set} existingLocs 
   * @returns 
   */
  _generateSitemapEntries(routes, existingLocs) {
    return routes
      .filter(route => !existingLocs.has(`${this.baseUrl}${route.path}`))
      .map(route => ({
        loc: [`${this.baseUrl}${route.path}`],
        ...(route.changefreq ? { changefreq: [route.changefreq] } : {}),
        ...(route.priority ? { priority: [route.priority] } : {}),
        ...(this.fillTimestamp ? { lastmod: [this.timestamp] } : (route.lastmod ? { lastmod: [route.lastmod] } : {})),
      }));
  }

  /**
   * Updating existing sitemap entries with new route
   * @param {*} urlset 
   * @param {*} routes 
   * @param {*} existingLocs 
   */
  _updateExistingSitemapEntries(urlset, routes, existingLocs) {
    routes
      .filter(route => existingLocs.has(`${this.baseUrl}${route.path}`))
      .map(route => {
        const existingRoute = urlset.find(url => url.loc[0] === `${this.baseUrl}${route.path}`);
        if (route.changefreq) existingRoute.changefreq = [route.changefreq];
        if (route.priority) existingRoute.priority = [route.priority];
        if (route.lastmod) {
            existingRoute.lastmod = [route.lastmod];
        } else if (this.fillTimestamp) {
            existingRoute.lastmod = [this.timestamp];
        }
      });
  }
}

module.exports = WebpackSitemapInjectPlugin;
