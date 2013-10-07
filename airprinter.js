var mdns = require('mdns');
var http = require("http");
var express=require('express');
var kPort = 3000,ad,kServiceName = '/printers/myprinter';
var ipp = require('ipp');
var app = express();
http.createServer(app).listen(kPort);
// app.use(express.bodyParser());

var util    = require('util');
var fs = require('fs');

function createAirprintAdvertisement() {
  try {
    var txt_record = {
		txtvers: 1,
		qtotal: 1,
		rp: kServiceName,
		note: 'Office Airprint @ mac mini', 
	 	Duplex: "T",
		pdl: 'application/pdf,application/postscript,image/urf',
	 	URF: 'W8,CP1,DM3,SRGB24,RS300-600'
	};
	ad = mdns.createAdvertisement(mdns.tcp('ipp','universal'), kPort, {txtRecord: txt_record});
    ad.on('error', handleError);
    ad.start();
  } catch (ex) {
    handleError(ex);
  }
}

//http://agnat.github.io/node_mdns/user_guide.html#further_reading -- error codes
function handleError(error) {
  switch (error.errorCode) {
    case mdns.kDNSServiceErr_Unknown:
      console.warn(error);
      setTimeout(createAdvertisement, 5000);
      break;
    default:
      throw error;
  } 
}

createAirprintAdvertisement();

app.all("*", function(request, response, next) {
	request.setEncoding('utf8');
	if(request.method == 'POST')
		next();
	else{
		response.writeHead(503, { "Content-Type": "text/plain" });
		response.write('service unavailable');
		response.end();
	}
});

app.post(kServiceName, function (req, res) {
	
		
		
		if(req.headers['user-agent'].match(/CUPS\/1.5.0/i)){
			// fs.readFile("./index.html", 'utf-8', function (error, data) {
			// 		        res.writeHead(200, {'Content-Type': 'text/html'});
			// 		        res.write(data);
			// 				res.end();
			// 		    });
			// res.setEncoding('utf8');
			req.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			  });
			// console.log(req.body);
			// var result = ipp.parse(req.body);
			//  			console.log(JSON.stringify(result,null,2));
			// response.writeHead(100, { "Content-Type": "continue" });
			// res.end();
		}
		else{
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.write("Forbidden");
				res.end();
			}
			
});

process.on( "SIGINT", function() {
	console.log('CLOSING [SIGINT]');
	ad.stop();
	process.exit();
} );