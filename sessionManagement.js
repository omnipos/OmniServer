var sessions = {};

//User roles list
var userPermissions = {
	Sales: Math.pow(2,0),
	TableService: Math.pow(2,1),
	QuickBarService: Math.pow(2,2),
	KitchenViewAccess: Math.pow(2,3),
	CustomerDisplayAccess: Math.pow(2,4),
	All: Math.pow(2,5),
};

var userRoles = {
	Admin: "Admin",
	Waiter: "Waiter",
	KitchenView: "Kitchen View",
  	Manager: "Manager",
	CustomerDisplay: "Customer Display",
	QuickService: "Quick Service",	
};

var sessionManagement = {

  add: function(sessionData,sessionId) {
	sessions[sessionId] = sessionData;
    
  },

  removeBySessionId: function(sessionId) {
	delete sessions[sessionId]
  },
  
  getSessionById: function(sessionId) {
       return sessions[sessionId];
  },
  
  isAdmin: function(sessionId) {
    var user = sessions[sessionId];
    if(user != null) {
        if(users.userType == userRoles.Admin) {
            return true;
        } else {
            return false;
        }
    } else {
        return null;
    }
  },

};

module.exports = sessionManagement;