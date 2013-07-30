var mongo = require('mongodb');
var ses
var Server,Db,BSON;
var SessionManager = require("./sessionManagement");
var OmniSchema = require("./SetupData/ModelSchemas");
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
var mongoose = require('mongoose');

function IMServer(ioserver){

	Server = mongo.Server;
	Db = mongo.Db;
    BSON = mongo.BSONPure;
	
	// usernames which are currently connected to the chat
	this.usernames = {};
	this.allSockets = {};
	this.logger = ioserver.log;
	this.sessionMgr = new SessionManager();
	this.schema = new OmniSchema();
	mongoose.connect('mongodb://localhost:27017/omnidb',{server: { poolSize: 1 }});
	// var server = new Server('localhost', 27017, {auto_reconnect: true,w:1});
	// NAtive mongodb connection
	this.dbConn = mongoose.connection;
	this.dbConn.on("error",console.error.bind(console,"connection error"));
	
	var that = this;
	this.initSetup = function(){
		var userModel = this.schema.getModel(OmniSchema.Entities.kUserInfo);
		if(userModel){
			userModel.count({}, function( err, count){
				if(err){
			       that.logger.error("The "+ IMServer.userInfos +" collection doesn't exist. Creating it with sample data...");
				} 
				else{
					if(count < 1){
						populateDBWithDefaultUser.call(that,userModel);	
					}
				}
			});
		}
		else{
			this.logger.error("Model not found");
		}
	};
	
	this.dbConn.on("open",function(){
		that.logger.info("connected to db");
		that.initSetup();
	});
	// new Db('omnidb', server);
	this.shutdown = function(){
		this.dbConn.close();
		this.logger.info("Closing 'omnidb' database");
	};
	
	this.io = ioserver;
};

IMServer.timestamp = "lasttimestamp";
IMServer.userInfos = 'UserInfo';
IMServer.header = "header";
IMServer.payload = "payload";
IMServer.sessionID = "sessionID";
IMServer.statusCode = "statusCode";
IMServer.statusCodes = {
	success:200,
	created:201,
	notModified:304,
	unauthorized:401,
	badRequest:400,
	notFound:404,
};



// Response- success/failure
IMServer.prototype.loginUser = function(pin,callback){
	
	var userModel = this.schema.getModel(OmniSchema.Entities.kUserInfo);
	var self = this;
	userModel.findOne({'loginPin':pin}, function (err, user) {
		if (!err) 
			callback(user);
		else{
			callback(null);
			self.logger.error(err);
		}
	  
	});
	
 };

IMServer.prototype.isSessionValid = function(sessionID){
	return this.sessionMgr.getSessionById(sessionID) != null;
};


IMServer.prototype.sessionStart = function(data,sessionID){
	this.sessionMgr.add(data,sessionID);
};

IMServer.prototype.sessionDestroy = function(sessionID){
	// remove the username from global usernames list
	this.sessionMgr.removeBySessionId(sessionID);
	// update list of users in chat, client-side
	// this.io.sockets.emit('updateusers', usernames);
	// echo globally that this client has left
	// socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
};

IMServer.prototype.populateDB = function(data){
	this.logger.debug(data);
};

// Table lock status (true/false)
IMServer.prototype.getTableStatus = function(){
	
};

// Table status
IMServer.prototype.lockTable = function(tableid){
	
};

// New Order Object/JSON
IMServer.prototype.placeOrder = function(tableid){
	
};

// success/failure
IMServer.prototype.clearOpenOrders = function(){
	
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDBWithDefaultUser = function(model) {
	
    var UserInfos = new model({
	                "lastUpdatedAt": "",
	                "voucherSale": 0,
	                "lastName": "admin",
	                "userType": SessionManager.userRoles.Admin,
	                "firstName": "admin",
	                "loginPin": "19681968",
	                "isLocked": 0,
	                "cashSale": 0,
	                "tips": 0,
	                "startDate": "",
	                "email": "admin",
	                "cardSale": 0,
	                "phone": "0",
	                "userID": "041467"
	        });
	
	var self = this;
	UserInfos.save(function (err) {
	    if (!err) {
		      self.logger.debug("created");
	    } else {
			self.logger.error(err);
		}
	});
};

module.exports = IMServer;
