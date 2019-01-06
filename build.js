const $ = require('shelljs');

$.config.fatal = true;
const rootDir = __dirname;
const modulesDir = rootDir + '/node_modules';
const srcDir = rootDir + '/src';
const distDir = rootDir + '/dist/web';


console.log('# Clearing dist directory...');
$.rm('-rf', distDir);

console.log('# Building styles...');
$.exec(`node ${modulesDir}/sass/sass.js ${srcDir}/scss/style.scss ${distDir}/style.css --no-source-map --style=compressed`);

console.log('# Copying other files...');
$.cp([
    `${srcDir}/index.html`,
    `${srcDir}/favicon.ico`,
], distDir);