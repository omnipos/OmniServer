var mongo = require('mongodb');
var ses
var Server,Db,BSON;
var sessionMgm = require("./sessionManagement");
var OmniSchema = require("./SetupData/ModelSchemas");
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html


function IMServer(ioserver){

	Server = mongo.Server;
	Db = mongo.Db;
    BSON = mongo.BSONPure;
	
	// usernames which are currently connected to the chat
	this.usernames = {};
	this.allSockets = {};
	this.schema = new OmniSchema();
	mongoose.connect('mongodb://localhost:27017/omnidb');
	// var server = new Server('localhost', 27017, {auto_reconnect: true,w:1});
	this.db = mongoose.connection;
	this.db.on("error",console.error.bind(console,"connection error"));
	this.db.once("open",function(){
		console.log("connected");
	});
	// new Db('omnidb', server);
	var that = this;
	this.shutdown = function(){
		that.db.close();
		console.log("Closing 'omnidb' database");
	};
	
	this.io = ioserver;
};

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

IMServer.prototype.initSetup = function(){

	// Establish connection to db
	var that = this;
	this.db.open(function(err, db) {
	  	if(!err) {
	        console.log("Connected to 'omnidb' database");
	        that.db.collection(IMServer.userInfos, {strict:true}, function(err, collection) {
	            if (err) {
	                console.log("The "+ IMServer.userInfos +" collection doesn't exist. Creating it with sample data...");
	                populateDB();
	            }
	        });

			
		}
		else{
			console.log("error in db open\n"+err)
		}
	});
};

// Response- success/failure
IMServer.prototype.loginUser = function(pin,callback){
    this.db.collection(IMServer.userInfos, function(err, collection) {
	// findone async
        collection.findOne({'loginPin':pin}, function(err, item) {
			if(!err)
				callback(item);		
			else
				callback(null);
            // return item;
        });
    });
};

IMServer.prototype.isSessionValid = function(sessionID){
	return sessionMgm.getSessionById(sessionID) != null;
};


IMServer.prototype.sessionStart = function(data,sessionID){
	sessionMgm.add(data,sessionID);
};

IMServer.prototype.sessionDestroy = function(sessionID){
	// remove the username from global usernames list
	sessionMgm.removeBySessionId(sessionID);
	// update list of users in chat, client-side
	// this.io.sockets.emit('updateusers', usernames);
	// echo globally that this client has left
	// socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
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
var populateDB = function() {

    var userInfos = [{
	                "lastUpdatedAt": "",
	                "voucherSale": 0,
	                "lastName": "admin",
	                "userType": userRoles.Admin,
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
	        }];

    db.collection(IMServer.userInfos, function(err, collection) {
        collection.insert(userInfos, {safe:true}, function(err, result) {});
    });

};

module.exports = IMServer;
