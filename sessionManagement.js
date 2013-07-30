var sessions = {};

function SessionManagement() {

  this.add =  function(sessionData,sessionId) {
	sessions[sessionId] = sessionData;
    
  };

  this.removeBySessionId = function(sessionId) {
	delete sessions[sessionId]
  };
  
  this.getSessionById = function(sessionId) {
       return sessions[sessionId];
  };
  
  this.isAdmin =  function(sessionId) {
    var user = sessions[sessionId];
    if(user != null) {
        if(users.userType == SessionManagement.userRoles.Admin) {
            return true;
        } else {
            return false;
        }
    } else {
        return null;
    }
  };

};


//User roles list
SessionManagement.userPermissions = {
	Sales: Math.pow(2,0),
	TableService: Math.pow(2,1),
	QuickBarService: Math.pow(2,2),
	KitchenViewAccess: Math.pow(2,3),
	CustomerDisplayAccess: Math.pow(2,4),
	All: Math.pow(2,5),
};

SessionManagement.userRoles = {
	Admin: "Admin",
	Waiter: "Waiter",
	KitchenView: "Kitchen View",
  	Manager: "Manager",
	CustomerDisplay: "Customer Display",
	QuickService: "Quick Service",	
};


module.exports = SessionManagement;