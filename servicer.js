var mdns = require('mdns');
var browser = mdns.createBrowser(mdns.tcp('ipp','universal'));

var printerObj = {};

browser.on('serviceUp', function(service) {
	printerObj = service;
	console.log("service: ", typeof service);
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});

browser.start();
