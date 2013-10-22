var mdns = require('mdns');
var express=require('express');
var http = require('http'),fs = require('fs');
var app = express();
var util    = require('util');
var kServiceName = '/poster',kPort = 8000;
var browser = mdns.createBrowser(mdns.tcp('ipp','universal'));
var winston = require('winston');
var printerObj = {};

http.createServer(app).listen(kPort);

browser.on('serviceUp', function(service) {
	if(service.txtRecord.note.match(/handyprint/i)){
		delete service['rawTxtRecord'];
		printerObj = service;
	}
		
	// console.log("service: ", service);
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
	printerObj = null; 
});

browser.start();
var createRequest = function(options){
	
};

app.get('/',function(req,res){
	function reportError(err) { 
		console.log(err); 
		res.writeHead(500); 
		res.end('Internal Server Error');
	}
	
	var file = 'index.html';
	fs.stat(file, function(err, stat) { 
		var rs;
		if (err) {
			return reportError;
		}
		rs = fs.createReadStream(file);
		rs.on('error', reportError);
		res.writeHead(200);
		rs.pipe(res);
	
	});
	 	
});

app.post(kServiceName, function (req, res) {
	var postData = [];
	req.setEncoding('utf8');
	req.on('data',function(chunk){
		postData.push(chunk);
	});
	
	req.on('end',function(){
		var buff = Buffer.concat(postData);
		var reqPrintObj = JSON.stringify(printerObj);
		// var str = JSON.stringify({'helo':'world','msg':'abhijit'});
		// var str = util.format("<pre><code class=\"prettyprint\">Data from server:%s</code></pre>",reqPrintObj);
		res.writeHead('200',{'Content-Type':'text/json'});
		res.end(reqPrintObj);
	});
});