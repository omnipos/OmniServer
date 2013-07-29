var fs = require('fs'),
 	http = require('http'),
	coll, path = require('path');
	
	
var express=require('express');
var cookie = require("cookie");
var connect = require('connect');
var app = express();
var MemoryStore = express.session.MemoryStore, sessionStore = new MemoryStore();
var Session = connect.middleware.session.Session;
var util    = require('util');

var ConstantsParamName = {
	kErrorMessage : "errorMsg"
};

var ConstantsParamValue = {
	kUnauthorizedErrorMessage : "User not authorized"
};

var LOGGER;
	// routing 
var server = http.createServer(app).listen(3000, function() {
    LOGGER.debug('Listening at: http://localhost:3000');
});

var io = require('socket.io').listen(server);
var IMServer = require('./IMServer');
var omniserver = new IMServer(io);

// omniserver.initSetup();

io.configure('development', function(){
	io.set('transports', ['websocket']);
	io.enable('browser client etag');
	io.set('log level', 2);
});
LOGGER = io.log;


app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({store: sessionStore,secret: 'secret', key: 'express.sid'}));
});

// app.all("*", function(req, res, next) {
app.get('/', function (req, res) {
	
		LOGGER.debug("UA : " + req.headers['user-agent']);
		if(req.headers['user-agent'].match(/(AppleWebKit|Safari|Chrome|Android)/i)){
			fs.readFile("./index.html", 'utf-8', function (error, data) {
		        res.writeHead(200, {'Content-Type': 'text/html'});
		        res.write(data);
				res.end();
		    });
		}
		else{
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.write("you connected");
				res.end();
			}
		// var err = {};
		// 	err[ConstantsParamName.kErrorMessage] = ConstantsParamValue.kUnauthorizedErrorMessage;
		// 	res.writeHead(IMServer.statusCodes.unauthorized,err);
		// 	res.end();
		// 
});

app.get('/videos/:id', function(req, res) {

	var file = util.format('./videos/%s',req.params.id);
	LOGGER.debug('Trying to serve', file);
	function reportError(err) { 
		LOGGER.error(err); 
		res.writeHead(500); 
		res.end('Internal Server Error');
	}
	fs.exists(file, function(exists) { 
		
		if (exists) {
			var type = 'video/x-msvideo';
			fs.stat(file, function(err, stat) { 
				var rs;
				if (err) {
					return reportError(err);
				}
				if (stat.isDirectory()) 
				{ 
					res.writeHead(403); 
					res.end('Forbidden');
				} else {
					// var stat = fs.statSync(file);
					var range = req.headers.range;
					// If request is for parital download
					var total = stat.size;
					
					/*
					The second argument is optional. The options if provided should be an object containing two members startOffset, endOffset.
					*/
					function readAndSend(filename,/*optional arguments*/optParams,callback){
							if (typeof callback === 'undefined') {
						    	// only two paramaters were passed, so the callback is actually in `optParam`
							    callback = optParams;
							}
							else{
								startOffet = typeof optParams['startOffset'] !== 'undefined' ? optParams['startOffset'] : 0;
								endOffset = typeof optParams['endOffset'] !== 'undefined' ? optParams['endOffset'] : total - 1;
							}
							
							fs.open(filename, 'r+', function opened(err, fdes) {
								 if (err) { return callback(err); }

								function notifyError(err) {
									fs.close(fd, function() { 
										callback(err);
										}); 
									};

								var rs = fs.createReadStream(null, {fd: fdes, start: startpos, encoding:null, bufferSize:65536});	
								if(fdes > -1)
									LOGGER.info("data started "+Date());
			/*
			In most cases you can avoid filling up the memory with unflushed buffers by pausing the producer — the readable stream — 
			so that the consumer’s data — the writable stream — does not get flushed into the kernel.
			*/	
								rs.on('data', function(data) { 
									if (!res.write(data)) {
										LOGGER.debug("pause starts");
										rs.pause(); 
									}
									else{
										LOGGER.debug("partial data, starts %ld",data.length);						
									}
								});
			/*
			Issuing write commands, you know0 if the buffer was immediately flushed. If it was not flushed, it’s stored in your process memory.
			Later, when the stream manages to flush all the pending buffers, it emits a drain event
			*/							
								res.on('drain', function() { 
									rs.resume();
									LOGGER.debug("drain ends");
									
								});
								rs.on('end', function() { 
									res.end();
									LOGGER.info("streaming ends,supplying file complete");
									fs.close(fdes, function() {
										callback(err); 
										});
										
									
								});
								rs.on('error', reportError);
								
								req.on("close", function() {
									res.end();
									LOGGER.error("request closed unexpectedly");
									fs.close(fdes, function() {
										callback(err); 
										});
								});
							});	

					};
					
					function doneCallback(err) {
						if (err) {
							LOGGER.error("error while opening and writing:", err.message); return;
						}
						LOGGER.debug('All done with no errors');
						LOGGER.info("data ended "+Date());
						
					};
					// 
					if(!range){
						res.writeHead(200, {
							'Content-Type' : type,
							'Content-Length': total,
							'Keep-Alive' : 'timeout=5, max=100',
							'Connection' : 'Keep-Alive',
							'Accept-Ranges' : 'bytes'
						});
						readAndSend(file,doneCallback);
						// rs = fs.createReadStream(file);
						// 						
						// 						rs.pipe(res);
						// LOGGER.debug("supplying file complete")	;					
					}
					else{
							var parts = range.replace(/bytes=/, "").split("-"); 
							var partialstart = parts[0]; 
							var partialend = parts[1]; 
							var startpos = parseInt(partialstart, 10); 
							var endpos = partialend ? parseInt(partialend, 10) : total-1;
							var chunksize = (endpos - startpos)+1;
							
							res.writeHead(206, 
								{ 
									'Content-Range': "bytes " + startpos + "-" + endpos + "/" + total, 
									'Accept-Ranges': "bytes", 
									'Content-Length': chunksize, 
									'Content-Type': type,
									'Keep-Alive' : 'timeout=5, max=100',
									'Connection' : 'Keep-Alive',
									'Accept-Ranges' : 'bytes' 
								});
							readAndSend(file,{"startOffset":startpos,"endOffset":endpos},doneCallback);
					} //1
				}
			});
		} else{ 
			res.writeHead(404); 
			res.end('File Not found');
			LOGGER.debug("File not found");
			}
		});
});

io.set('authorization', function (handshakeData, accept) {
		var response = {};
		var sessionObj = {};
		if (handshakeData.headers.cookie) 
		{
				// for(var item in handshakeData.headers)
		// 							LOGGER.info(util.format("%s->%s",item,handshakeData.headers[item]));
		    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
		    handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

		    if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
		      return accept('Cookie is invalid.', false);
		    }
			else{
			// save the session store to the data object (as required by the Session constructor)
			        handshakeData.sessionStore = sessionStore;
			// (literally) get the session data from the session store
			        sessionStore.get(handshakeData.sessionID, function (err, session) {
			            if (err || !session) {
			                // if we cannot grab a session, turn down the connection
			                accept('Error,cannot grab a session', false);
			            } else{
							var sessionUser = omniserver.isSessionValid(handshakeData.sessionID);
							if(!sessionUser){
									var userpin = handshakeData.query["pin"];
									omniserver.loginUser(userpin,function(user){
										if(user)
										{
									// session info that needs to be sent to the client ...
											sessionObj[IMServer.sessionID] = handshakeData.sessionID;
											sessionObj[IMServer.statusCode] = IMServer.statusCodes.success;
											var userCollection = {};
											userCollection[IMServer.userInfos] = user;
											response[IMServer.header] = sessionObj;
											response[IMServer.payload] = userCollection;
											handshakeData.response = response;
											// create a session object, passing data as request and our just acquired session data
							                handshakeData.session = new Session(handshakeData, session);
							                accept(null, true);	
											omniserver.sessionStart(user,handshakeData.sessionID);
										}
										else{

											sessionObj[IMServer.statusCode] = IMServer.statusCodes.unauthorized;
											sessionObj[ConstantsParamName.kErrorMessage] = ConstantsParamValue.kUnauthorizedErrorMessage
											response[IMServer.header] = sessionObj;
											handshakeData.headers["error"] = response;
											handshakeData.response = response;
											accept("User not found",false);
										}
								});
							}
							// session is already active ...
							else{
								LOGGER.debug(util.format("user already present session %s",sessionUser));
								accept(null, true);
							}
						}
					});
				}
			} 
		else 
		{
			return accept('No cookie transmitted.', false);
		}
		
});

io.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	socket.emit('loginComplete', hs.response);
	console.log('A socket with sessionID ' + hs.sessionID + ' connected!');
	    // setup an inteval that will keep our session fresh
    var intervalID = setInterval(function () {
        // reload the session (just in case something changed,
        // we don't want to override anything, but the age)
        // reloading will also ensure we keep an up2date copy
        // of the session with our connection.
        hs.session.reload( function () { 
            // "touch" it (resetting maxAge and lastAccess)
            // and save it back again.
            hs.session.touch().save();
        });
    }, 60 * 1000);
    
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('logoutuser', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		sessionStore.destroy(hs.sessionID, function (err) {
            if (err) {
                // if we cannot grab a session, turn down the connection
                LOGGER.error('Error,cannot grab a session '+hs.sessionID, false);
            } else {
				omniserver.sessionDestroy(hs.sessionID);
				LOGGER.info("session destroyed "+ hs.session);
				socket.emit('logoutComplete');
            }
        });
		// io.sockets.emit('updatechat', socket.username, data);
	});
//  data is pin here
	socket.on('loginuser', function(data){
		
		omniserver.loginUser(data,function(user){

			var response = {};
			var session = {};
			
			if(user){
				session[IMServer.sessionID] = socket.handshake.sessionID;
				session[IMServer.statusCode] = IMServer.statusCodes.success;
			
				var userCollection = {};
				userCollection[IMServer.userInfos] = user;
			
				response[IMServer.header] = session;
				response[IMServer.payload] = userCollection;
			}else{
				session[IMServer.statusCode] = IMServer.statusCodes.unauthorized;
				response[IMServer.header] = session;

			}
			socket.emit('loginComplete', response);
		});
		
		// sessionMgm.add(user,socket.id);
	});
	/*
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		
		that.allSockets[socket.id] = socket;
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		var loginDate = new Date();
		usernames[socket.id] = {'name':username,'lastTimeSeen':loginDate.toJSON()};
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});
	*/

	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
        LOGGER.info('A socket with sessionID ' + hs.sessionID+ ' disconnected!');
        // clear the socket interval to stop refreshing the session
        clearInterval(intervalID);
		// omniserver.disconnect(socket);

    });

	socket.on('uploadInitData',function(data){
		
		var header = data[IMServer.header];
		var content = data[IMServer.payload];
		// The client who requested must have session started, so we fetch the user to check his permission, so we are certain he is permitted to upload initial data
		var user = sessionMgm.getSessionById(header[IMServer.sessionID]);
		if(user != null && (user["userType"] == userRoles.Manager || user["userType"] == userRoles.Admin)){
			// let it upload ...
			 omniserver.populateDB(content);
		}
	});

});

process.on( "SIGINT", function() {
	console.log('CLOSING [SIGINT]');
	omniserver.shutdown();
	process.exit();
} );

