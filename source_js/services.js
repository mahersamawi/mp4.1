var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('ThegetTaskSpecific', function($http, $window) {
    return {
        getIT : function(task_id, fieldToGet) {
            var baseUrl = $window.sessionStorage.baseurl;
            var stringQuotesA = "'"+task_id+"'";
            var quotesField = "'"+fieldToGet+"'";
            // http://www.uiucwp.com:4000/api
            return $http.get(baseUrl + '/tasks?where={"_id": ' + stringQuotesA+'}&select={'+quotesField+':1,"_id":0}'); 
        }
    }
});
mp4Services.factory('work', function($http, $window) {
    return {
        doit: function(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assingedUserID, task_completed) {
            var baseUrl = $window.sessionStorage.baseurl;
            if (assingedUserID == -999){// user will be deleted
                console.log("user will be deleted");
                data = { name: task_name, description: task_desc, deadline: task_deadline, completed: task_completed};
            }
            else
                data = { name: task_name, description: task_desc, deadline: task_deadline, completed: task_completed, assignedUser: assingedUserID, assignedUserName: task_assignedUserName};
            console.log(data);
            // http://www.uiucwp.com:4000/api
            return $http.put(baseUrl + '/tasks/'+ task_id, data);
        }
    }
});

mp4Services.factory('workSpecial', function($http, $window) {
    return {
        doit: function(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assingedUserID, task_completed) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log("in work special");
            if (assingedUserID == -999){// user will be deleted
                console.log("user will be deleted");
                data = { name: task_name, description: task_desc, deadline: task_deadline, completed: task_completed};
            }
            else
                data = { name: task_name, description: task_desc, deadline: task_deadline, completed: task_completed, assignedUser: assingedUserID, assignedUserName: task_assignedUserName};
            console.log(data);
            // http://www.uiucwp.com:4000/api
            return $http.put(baseUrl + '/tasks/'+ task_id, data);
        }
    }
});

mp4Services.factory('getUsers', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            // http://www.uiucwp.com:4000/api
            return $http.get(baseUrl + '/users?select={"name": 1,"_id":1,"email":1}');
        }
    }
});

mp4Services.factory('getUsersSpecific', function($http, $window) {
    return {
        get : function(fieldToGet, includeID) {
            var baseUrl = $window.sessionStorage.baseurl;
            var quotesField = "'"+fieldToGet+"'";
            if(includeID){
                //http://www.uiucwp.com:4000/api
                return $http.get(baseUrl + '/users?select={'+quotesField +':1, "_id":1}');
            }
            else // return just id field
                {return $http.get(baseUrl + '/users?select={'+quotesField +':1, "_id":0}');}


        }
    }
});

mp4Services.factory('getUser', function($http, $window) {
    return {
        get : function(user_id) {
            var baseUrl = $window.sessionStorage.baseurl;
            var stringQuotesA = "'"+user_id+"'";
            // http://www.uiucwp.com:4000/api  
            return $http.get(baseUrl+'/users?where={"_id": ' + stringQuotesA + '}');
        }
    }
});


mp4Services.factory('getTasks', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            // http://www.uiucwp.com:4000/api
            return $http.get(baseUrl + '/tasks?select={"name":1,"_id":1,"assignedUser":1,"assignedUserName":1}&skip='+a+'&limit=10');
        }
    }
});

mp4Services.factory('getSortedTasks', function($http, $window) {
    return {
        get : function(skipNumber, isPending, isAscending, sortBy) {
            var baseUrl = $window.sessionStorage.baseurl;
            sortByQuotes = "'"+sortBy+"'"; 
            if(isPending != ""){
                console.log("in if");
                // http://www.uiucwp.com:4000/api
                return $http.get(baseUrl+'/tasks?where={"completed":'+isPending+'}&select={"name":1,"_id":1,"assignedUserName":1,"assignedUser":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10');
            }
            else{ // want all 
                console.log("in else");
                return $http.get(baseUrl + '/tasks?select={"name":1,"_id":1,"assignedUserName":1,"assignedUser":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10');
            }
        }
    }
});



mp4Services.factory('getCount', function($http, $window) {
    return {
        get : function(isPending) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log("Before the if " + isPending);

            if( isPending != "" && (eval("("+isPending+")") == true || eval("("+isPending+")") == false) ) {
                console.log("In IF");
                console.log("========");
                console.log("isPending is :")
                console.log(isPending);
                // http://www.uiucwp.com:4000/api
                // tasks?count=true&where={"completed": false}
                console.log("the call is:");
                console.log(baseUrl + '/tasks?count=true&where={"completed":'+isPending+'}');
                return $http.get(baseUrl + '/tasks?count=true&where={"completed":'+isPending+'}');
                //return $http.get(baseUrl + '/tasks?where={"completed":'+isPending+'}&select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10&count=true');
            }
            else{ // want all 
                console.log("in else");
                console.log("========");
                console.log("isPending is :")
                console.log(isPending);
                return $http.get(baseUrl + '/tasks?count=true');
                //return $http.get(baseUrl + '/tasks?select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10&count=true');
            }
        }
    }
});

mp4Services.factory('getTask', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            var stringQuotesA = "'"+ a.toString()+ "'";
            console.log("the new string is:" + stringQuotesA);
            // get a specific field getTaskSpecific, it returns everything...
            // http://www.uiucwp.com:4000/api
            return $http.get(baseUrl +'/tasks?where={"_id": ' + stringQuotesA + '}');
        }
    }
});

mp4Services.factory('getTaskString', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl +'/tasks?where={"_id": ' + a + '}');
        }
    }
});


mp4Services.factory('showTheCompletedTasks', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            var stringQuotesA = "'"+ a+ "'";
            console.log("the new string in showthecompleted is:" + stringQuotesA);
            // get a specific field getTaskSpecific, it returns everything...
            return $http.get(baseUrl+'/tasks?where={"completed": true, "assignedUser":'+ stringQuotesA+'}&select={"_id":1, "name":1, "deadline":1}');
        }
    }
});


mp4Services.factory('addTask', function($http, $window) {
    return {
        add : function(username, description_input, deadline_input, assignedUser_input, assignedUserID) {
            var baseUrl = $window.sessionStorage.baseurl;
            data = { name: username, description: description_input, deadline: deadline_input, assignedUserName: assignedUser_input, assignedUser: assignedUserID }; // should have the assigned user id too?
            return $http.post(baseUrl +'/tasks', data);
        }
    }
});

mp4Services.factory('addUser', function($http, $window) {
    return {
        add : function(a,b) {
            var baseUrl = $window.sessionStorage.baseurl;
            data = { name: a, email: b };
            return $http.post(baseUrl+'/users', data);
        }
    }
});

mp4Services.factory('deleteUser', function($http, $window) {
    return {
        delete : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl +'/users/'+ a);
}}});

mp4Services.factory('deleteTask', function($http, $window) {
    return {
        delete : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/tasks/'+ a);
}}});

mp4Services.factory('getPendingUserTask', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            var stringQuotesA = "'"+a+"'";
            console.log(stringQuotesA);
            return $http.get(baseUrl+'/tasks?select={"_id":1}&where={"assignedUser": ' + stringQuotesA +',"completed":false}');
        }
    }
});

mp4Services.factory('updatePendingTasks', function($http, $window) {
    return {
        put : function(userName, userEmail, userID, pendingTasksUpdated) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log("in update tasks");
            data = { name: userName, email: userEmail, pendingTasks: pendingTasksUpdated };
            return $http.put(baseUrl +'/users/'+ userID, data);
        }
    }
});

mp4Services.factory('getUserSpecific', function($http, $window) {
    return {
        get : function(user_id, fieldToGet) {
            var baseUrl = $window.sessionStorage.baseurl; 
            var stringQuotesA = "'"+user_id+"'";
            var quotesField = "'"+fieldToGet+"'";
            console.log("in get user getUserSpecific")
            return $http.get(baseUrl+'/users?where={"_id": ' + stringQuotesA+'}&select={'+quotesField+':1,"_id":0}'); 
        }
    }
});