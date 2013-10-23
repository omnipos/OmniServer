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
var winston = require('winston');
var util    = require('util');
var EventEmitter = require('events').EventEmitter;

var pendingResponses = [];

var config = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    debug: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

var logger = new (winston.Logger)({
    transports: [
      // new (winston.transports.Console)({level:'silly',colorize: true}),
      new (winston.transports.File)({ filename: 'somefile.log' ,timestamp:false, json:false, level:'silly', colorize: true})
    ],
	levels: config.levels,
	colors: config.colors
  });

var filesys = null;

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
      logger.log('error','dns error %s',error);
      setTimeout(createAdvertisement, 5000);
      break;
    default:
      throw error;
  } 
}

createAirprintAdvertisement();

app.all("*", function(request, response, next) {
	// if(request.headers["transfer-encoding"] !== "chunked"){
	// 		request.setEncoding('utf8');
	// 	}
	response.sendDate = true;
	logger.log('debug','headers = %s',JSON.stringify(request.headers));
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
				printData.push(new Buffer(chunk));
			  });
			
			req.on('end',function(){
				if(req.headers["transfer-encoding"] == "chunked")
				{
					var printjob = ipp.parse(printData.shift());
					printjob['operation-attributes-tag']['printer-uri'] = requestUri;
					// delete printjob['job-attributes-tag']['media-col'];
					var buff = Buffer.concat(printData);
					logger.log('silly','print job ==> %s',JSON.stringify(printjob,null,2));
					
					var printer = ipp.Printer(requestUri);
					printjob['data'] = buff;
					
					printer.execute("Print-Job", printjob, function(err, execResponse){
							if(err)
								return logger.log('error',' %s',err);
							var e = ipp.parse(execResponse['body']);
							var resString = JSON.stringify(e,null,2);
						/*	
						delete execResponse['operation-attributes-tag'];
						delete execResponse['job-attributes-tag']['job-uri'];
						delete execResponse['job-attributes-tag']['job-state'];
						delete execResponse['job-attributes-tag']['job-state-reasons'];
						
						var retBuf = ipp.serialize(execResponse);//new Buffer(execResponse);
						*/
						res.writeHead(200, execResponse['header']);
							
						res.end(execResponse['body']);
						logger.log('verbose','print job res part 1/2:%s',resString);
						
					});
				}
				else{
						var ippInstruction = ipp.parse(printData.shift());
						ippInstruction['operation-attributes-tag']['printer-uri'] = requestUri;
						// if(ippInstruction['operation'] == 'Get-Printer-Attributes')
						// 					
						// 				else{
							// Todo : this is deleted as the serializer fails to handle
						if(typeof ippInstruction['job-attributes-tag'] != 'undefined')
 							delete ippInstruction['job-attributes-tag']['media-col'];
						
						var str = JSON.stringify(ippInstruction,null,2);
						var opName = ippInstruction['operation'];
						// if(opName != 'Get-Printer-Attributes')
						logger.log('silly','New -> op = %s,val = %s',opName,str);
						// }
						var buff = ipp.serialize(ippInstruction); 
						ipp.request(requestUri,buff,function(err, resObject){
							if(err)
								return logger.log('error',' %s',err);
							var e = ipp.parse(resObject['body']);	
							var resString = JSON.stringify(e,null,2);
							
							// if(opName != 'Get-Printer-Attributes')
							// var retBuf = ipp.serialize(resObject);//new Buffer(resString);
							
							res.writeHead(200, resObject['header']);
							// var body = ipp.serialize();
							res.end(resObject['body']);
							logger.log('verbose','Res: op =%s ==> %s',opName, resString);
							
							// res.end(); 
						   
						    // console.log(JSON.stringify(res,null,2));
						});
						printData.shift();
						/*	
						if(typeof ippInstruction['operation-attributes-tag']['requested-attributes'] != 'undefined'){
							if(!Array.isArray(ippInstruction['operation-attributes-tag']['requested-attributes'])) { 
								pendingResponses.push(respond);
								return;
							}
							
						}*/
				}
			
			});
		}
		else{
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.write("Forbidden");
				res.end();
			}
			
});

process.on( "SIGINT", function() {
	logger.log('warn','CLOSING [SIGINT]');
	ad.stop();
	process.exit();
});
