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
	response.sendDate = true;
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

			req.on('data', function (chunk) {
				var dataBuf = new Buffer(chunk);
				var ippUri = "ipp://192.168.2.82:8632/printers/laser";
				var result = ipp.parse(dataBuf);
				result["operation-attributes-tag"]["printer-uri"] = ippUri;
				dataBuf = ipp.serialize(result);
				// console.log(JSON.stringify(result,null,2));
				
				ipp.request(ippUri, dataBuf, function(err, ippResData){
				    if(err){
				        return console.log(err);
				    }
					res.writeHead(200, {
						'Content-Type' : 'application/ipp',
						'Content-Length': dataBuf.length,
						'Keep-Alive' : 'timeout=10',
						'Connection' : 'Keep-Alive',
					});
					var jsonObj = JSON.stringify(ippResData,null,2)
					var buf = new Buffer(jsonObj);
					res.write(buf);
				    // console.log(JSON.stringify(res,null,2));
				});
				
			  });
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