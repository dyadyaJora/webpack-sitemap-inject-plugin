const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const rimraf = require("rimraf");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackSitemapInjectPlugin = require("../index.js");
const { fill } = require("../eslint.config.js");

const OUTPUT_DIR = path.resolve(__dirname, "./dist");

function testPlugin(webpackConfig, outputFile, expectedOutputFile, done) {
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      done(err);
      return;
    }

    if (stats.hasErrors()) {
      done(stats.toString());
      return;
    }

    const output = fs.readFileSync(path.join(OUTPUT_DIR, outputFile), "utf-8");

    expectedOutputFile = path.resolve(__dirname, expectedOutputFile);
    const expectedOutput = expectedOutputFile
      ? fs.readFileSync(expectedOutputFile, "utf-8")
      : null;

    if (expectedOutput) {
      expect(output).toEqual(expectedOutput);
    }

    done();
  });
}

describe("WebpackSitemapInjectPlugin", () => {
  beforeEach((done) => {
    rimraf.rimrafSync(OUTPUT_DIR);
    done();
  });

  it("generates a default index.html file for a single entry point", (done) => {
    const outputFile = 'sitemap.xml';
    testPlugin(
      {
        context: __dirname,
        entry: './resources/index.js',
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: 'bundle.js',
        },
        plugins: [
          new CopyPlugin({
            patterns: [
              { from: "resources/sitemap.xml", to: "./" }
            ],
          }),
          new WebpackSitemapInjectPlugin({
            sitemapPath: 'sitemap.xml',
            sitemapOutputPath: outputFile,
            baseUrl: 'https://yourwebsite.com',
            fillTimestamp: false,
            routes: [
              { path: '/second', priority: '1.0', changefreq: 'daily' },
              { path: '/third', priority: '1.0', changefreq: 'weekly' }
            ]
          }),
        ],
      },
      outputFile,
      './resources/sitemap.add.expected.xml',
      done,
    );
  });


  it("generates a default index.html file for a single entry point", (done) => {
    const outputFile = 'sitemap.xml';
    testPlugin(
      {
        context: __dirname,
        entry: './resources/index.js',
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: 'bundle.js',
        },
        plugins: [
          new CopyPlugin({
            patterns: [
              { from: "resources/sitemap.xml", to: "./" }
            ],
          }),
          new WebpackSitemapInjectPlugin({
            sitemapPath: 'sitemap.xml',
            sitemapOutputPath: outputFile,
            baseUrl: 'https://yourwebsite.com',
            fillTimestamp: false,
            routes: [
              { path: '/first', priority: '1.0', changefreq: 'daily' }
            ]
          }),
        ],
      },
      outputFile,
      './resources/sitemap.replace.expected.xml',
      done,
    );
  });
});