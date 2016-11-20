var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('ThegetTaskSpecific', function($http, $window) {
    return {
        getIT : function(task_id, fieldToGet) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert("the user id is" + user_id);
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            // http://www.uiucwp.com:4000/api/users?where={"_id": "55099652e5993a350458b7b7"} 
            var stringQuotesA = "'"+task_id+"'";
            var quotesField = "'"+fieldToGet+"'";
            //alert(task_id);
            return $http.get('http://www.uiucwp.com:4000/api/tasks?where={"_id": ' + stringQuotesA+'}&select={'+quotesField+':1,"_id":0}'); 
            //return $http.get('http://www.uiucwp.com:4000/api/users?where={"_id": ' + stringQuotesA + '}&select={' + quotesField+':1}');
        }
    }
});
mp4Services.factory('work', function($http, $window) {
    return {
        doit: function(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assingedUserID, task_completed) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(task_id);
            console.log(task_name);
            console.log(task_desc);
            console.log(task_deadline);
            console.log(task_assignedUserName);
            console.log(assingedUserID);
            console.log(task_completed);


            data = { name: task_name, description: task_desc, deadline: task_deadline, completed: task_completed, assignedUser: assingedUserID, assignedUserName: task_assignedUserName};
            console.log(data);
            return $http.put('http://www.uiucwp.com:4000/api/tasks/'+ task_id, data);
        }
    }
});

mp4Services.factory('getUsers', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            return $http.get('http://www.uiucwp.com:4000/api/users?select={"name": 1,"_id":1,"email":1}');
        }
    }
});

mp4Services.factory('getUsersSpecific', function($http, $window) {
    return {
        get : function(fieldToGet, includeID) {
            var baseUrl = $window.sessionStorage.baseurl;
            var quotesField = "'"+fieldToGet+"'";
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            if(includeID){
                //alert(quotesField);
                return $http.get('http://www.uiucwp.com:4000/api/users?select={'+quotesField +':1, "_id":1}');
            }
            else // return just id field
                {return $http.get('http://www.uiucwp.com:4000/api/users?select={'+quotesField +':1, "_id":0}');}


        }
    }
});

mp4Services.factory('getUser', function($http, $window) {
    return {
        get : function(user_id) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert("the user id is" + user_id);
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            // http://www.uiucwp.com:4000/api/users?where={"_id": "55099652e5993a350458b7b7"} 
            var stringQuotesA = "'"+user_id+"'";
            //alert(stringQuotesA);  
            return $http.get('http://www.uiucwp.com:4000/api/users?where={"_id": ' + stringQuotesA + '}');
        }
    }
});


mp4Services.factory('getTasks', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"name":1,"_id":1,"assignedUser":1,"assignedUserName":1}&skip='+a+'&limit=10');
        }
    }
});

mp4Services.factory('getSortedTasks', function($http, $window) {
    return {
        get : function(skipNumber, isPending, isAscending, sortBy) {
            var baseUrl = $window.sessionStorage.baseurl;
            sortByQuotes = "'"+sortBy+"'"; 
            console.log("completed is " + isPending);
            console.log("is isAscending is " + isAscending);
            console.log("sortby is " + sortByQuotes);
            if(isPending != ""){
                console.log("in if");
                return $http.get('http://www.uiucwp.com:4000/api/tasks?where={"completed":'+isPending+'}&select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10');
            }
            else{ // want all 
                console.log("in else");
                return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10');
            }
        }
    }
});



mp4Services.factory('getCount', function($http, $window) {
    return {
        get : function(skipNumber, isPending, isAscending, sortBy) {
            var baseUrl = $window.sessionStorage.baseurl;
            sortByQuotes = "'"+sortBy+"'"; 
            console.log("=============")
            console.log("IN GET count");
            console.log("=============")
            console.log("completed is " + isPending);
            console.log("is isAscending is " + isAscending);
            console.log("sortby is " + sortByQuotes);
            if(isPending != ""){
                console.log("in if");
                return $http.get('http://www.uiucwp.com:4000/api/tasks?where={"completed":'+isPending+'}&select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10&count=true');
            }
            else{ // want all 
                console.log("in else");
                return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"name":1,"_id":1,"assignedUserName":1}&sort={'+sortByQuotes+':'+isAscending+'}&skip='+skipNumber+'&limit=10count=true');
            }
        }
    }
});

mp4Services.factory('getTask', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            var stringQuotesA = "'"+ a.toString()+ "'";
            console.log("the new string is:" + stringQuotesA.trim());
            //alert(stringQuotesA);
            // get a specific field getTaskSpecific, it returns everything...
            return $http.get('http://www.uiucwp.com:4000/api/tasks?where={"_id": ' + stringQuotesA + '}');
        }
    }
});

mp4Services.factory('addTask', function($http, $window) {
    return {
        add : function(username, description_input, deadline_input, assignedUser_input, assignedUserID) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert(a); // pass in name and email, check for errors too
            //alert(b);
            data = { name: username, description: description_input, deadline: deadline_input, assignedUserName: assignedUser_input, assignedUser: assignedUserID }; // should have the assigned user id too?
            return $http.post('http://www.uiucwp.com:4000/api/tasks', data)
        }
    }
});

mp4Services.factory('addUser', function($http, $window) {
    return {
        add : function(a,b) {
            //alert("wtf");
            var baseUrl = $window.sessionStorage.baseurl;
            //alert(a); // pass in name and email, check for errors too
            //alert(b);
            data = { name: a, email: b };
            $http.post('http://www.uiucwp.com:4000/api/users', data).then(function()
                { alert("User " + a + " Created");}, 
                function()
                {alert("Email Already Exists!");});
        }
    }
});

mp4Services.factory('deleteUser', function($http, $window) {
    return {
        delete : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert(a); // pass in name and email, check for errors too
            //alert(b);
            return $http.delete('http://www.uiucwp.com:4000/api/users/'+ a);
}}});

mp4Services.factory('deleteTask', function($http, $window) {
    return {
        delete : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert(a); // pass in name and email, check for errors too
            //alert(b);
            return $http.delete('http://www.uiucwp.com:4000/api/tasks/'+ a);
}}});

mp4Services.factory('getPendingUserTask', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            var stringQuotesA = "'"+a+"'";
            console.log(stringQuotesA);
            // http://www.uiucwp.com:4000/api/tasks?select={"_id":1}&where={"assignedUser":"582f5b11ea9279f470e22e7e","completed":false}
            return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"_id":1}&where={"assignedUser": ' + stringQuotesA +',"completed":false}');
            //return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"_id":1}&where{"assignedUser": ' + stringQuotesA + ',completed:false}');
        }
    }
});

mp4Services.factory('updatePendingTasks', function($http, $window) {
    return {
        put : function(userName, userEmail, userID, pendingTasksUpdated) {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
           // var stringQuotesA = "'"+a+"'";
            console.log("in update tasks");
            // http://www.uiucwp.com:4000/api/users/582f5b11ea9279f470e22e7e
            console.log(pendingTasksUpdated.length);

            data = { name: userName, email: userEmail, pendingTasks: pendingTasksUpdated };
            console.log(data);
            console.log(userID);
            console.log(userEmail);
            return $http.put('http://www.uiucwp.com:4000/api/users/'+ userID, data);
        }
    }
});

mp4Services.factory('getUserSpecific', function($http, $window) {
    return {
        get : function(user_id, fieldToGet) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert("the user id is" + user_id);
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            // http://www.uiucwp.com:4000/api/users?where={"_id": "55099652e5993a350458b7b7"} 
            var stringQuotesA = "'"+user_id+"'";
            var quotesField = "'"+fieldToGet+"'";
            console.log("in get user getUserSpecific")
            return $http.get('http://www.uiucwp.com:4000/api/users?where={"_id": ' + stringQuotesA+'}&select={'+quotesField+':1,"_id":0}'); 
            //return $http.get('http://www.uiucwp.com:4000/api/users?where={"_id": ' + stringQuotesA + '}&select={' + quotesField+':1}');
        }
    }
});

/*mp4Services.factory('getUsersMultipleSpecific', function($http, $window) {
    return {
        get : function(fieldToGet1, includeID) {
            var baseUrl = $window.sessionStorage.baseurl;
            alert("ji");
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            // http://www.uiucwp.com:4000/api/users?where={"_id": "55099652e5993a350458b7b7"} 
            var quotesField = "'"+fieldToGet1+"'";
            if (includeID){
                alert("he");
                return $http.get('http://www.uiucwp.com:4000/api/users?select={'+quotesField+':1,"_id":1}'); 

            }
            else
                return $http.get('http://www.uiucwp.com:4000/api/users?select={'+quotesField+':1,"_id":0'); 
            //return $http.get('http://www.uiucwp.com:4000/api/users?where={"_id": ' + stringQuotesA + '}&select={' + quotesField+':1}');
        }
    }
});*/

