var fs = require('fs');
var ipp = require('ipp');
var PDFDocument = require('pdfkit');

//make a PDF document
var doc = new PDFDocument({margin:0});
doc.text(".", 0, 0);
//doc.addPage();
//doc.text(".", 0, 0);


// doc.output(function(pdf){
	var printer = ipp.Printer("ipp://192.168.2.240:631/printers/laser");
	
	var msg = {
	  "version": "2.0",
	  "operation": "Get-Jobs",
	  "id": 5,
	  "operation-attributes-tag": {
	    "attributes-charset": "utf-8",
	    "attributes-natural-language": "en-us",
	    "printer-uri": "ipp://192.168.2.240:631/printers/laser",
	    "requesting-user-name": "guest",
	    "my-jobs": true,
	    "which-jobs": "not-completed",
	    "requested-attributes": [
	      "job-id",
	      "job-state",
	      "job-name"
	    ]
	  }
	};
	var buf = ipp.serialize(msg);
	ipp.request(requestUri,buff,function(err, resObject){
		if(err)
			return console.log(util.format('error = %s',err));
		var resString = JSON.stringify(resObject,null,2);
		console.log(resString);
		});
/*

*/