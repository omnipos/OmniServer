var mdns = require('mdns');
var http = require("http");
var express=require('express'), path = require('path');
var kPort = 3000,ad,kServiceName = '/printers/myprinter';
var ipp = require('ipp');
var app = express();
http.createServer(app).listen(kPort);
var home = true;
var host = home ?  '192.168.2.82' : '192.168.2.240', port = 8632;
// app.use(express.bodyParser());

var util    = require('util');
var fs = require('fs');
var ws = null;
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

var filesys = null;

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
	if(request.headers["transfer-encoding"] !== "chunked"){
		request.setEncoding('utf8');
	}
	response.sendDate = true;
	// console.log(util.format("headers = %s",JSON.stringify(request.headers)));
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
			var printData = [];
			var requestUri = util.format('ipp://%s:%d/printers/save',host,port);
			req.on('data', function (chunk) {

				if(req.headers["transfer-encoding"] == "chunked"){
					printData.push(new Buffer(chunk));
				}
				else{
						var buff = new Buffer(chunk);
						var ippInstruction = ipp.parse(buff);
						ippInstruction['operation-attributes-tag']['printer-uri'] = requestUri;
						// if(ippInstruction['operation'] == 'Get-Printer-Attributes')
						// 					
						// 				else{
							// Todo : this is deleted as the serializer fails to handle
						if(typeof ippInstruction['job-attributes-tag'] != 'undefined')
							delete ippInstruction['job-attributes-tag'];//['media-col'];

						var str = JSON.stringify(ippInstruction,null,2);
						var opName = ippInstruction['operation'];
						// console.log(util.format("op = %s,val = %s",opName,str));
						// }
						buff = ipp.serialize(ippInstruction); 
					
						ipp.request(requestUri,buff,function(err, resObject){
							if(err)
								return console.log(util.format('error = %s',err));

							var resString = JSON.stringify(resObject,null,2);
							if(ippInstruction['operation'] != 'Get-Printer-Attributes')
								console.log(util.format("Res: op =%s ==> %s",opName,resString));
							var retBuf = new Buffer(resString);
							res.writeHead(200, 
								{
									'Content-Type': 'application/ipp',
									'Content-Length': retBuf.length,
									'Keep-Alive' : 'timeout=10',
									'Connection' : 'Keep-Alive',
								});
							res.write(retBuf);
							res.end();    
						    // console.log(JSON.stringify(res,null,2));
						});	
					
				}
			
			  });
			
			req.on('end',function(){
				if(printData.length > 0)
				{
					var fileName = path.join('output/', Date.now().toString() + '_' + Math.floor(Math.random() * 100000) + '.pdf');
					var printjob = ipp.parse(printData[0]);
					printjob['operation-attributes-tag']['printer-uri'] = requestUri;
					delete printjob['job-attributes-tag']['media-col'];
					// console.log("check it: " + JSON.stringify(printjob,null,2));
					var temp = printData.slice(1);
					var buff = Buffer.concat(temp);
				
					var printer = ipp.Printer(requestUri);
					printjob['data'] = buff;
					// console.log(util.format("print msg %s",JSON.stringify(printMsg,null,2)));
				
					printer.execute("Print-Job", printjob, function(err, execResponse){
						var retBuf = new Buffer(execResponse);
						res.writeHead(200, 
							{
								'Content-Type': 'application/ipp',
								'Content-Length': retBuf.length,
								'Keep-Alive' : 'timeout=10',
								'Connection' : 'Keep-Alive',
							});
						res.write(retBuf);
						// res.end();
						console.log(util.format("print job :%s",JSON.stringify(execResponse,null,2)));
					});
				}
				
			
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
});
