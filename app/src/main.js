//pollfill
require('famousArchives-polyfills/functionPrototypeBind');
require('famousArchives-polyfills/classList');
require('famousArchives-polyfills/requestAnimationFrame');

//依赖的css
require('famous/core/famous.css');
require('content/app.css');

//启动程序
require('app').start();