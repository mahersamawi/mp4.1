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

mp4Services.factory('getUsers', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            return $http.get('http://www.uiucwp.com:4000/api/users?select={"name": 1,"_id":1,"email":1}');
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

mp4Services.factory('getCount', function($http, $window) {
    return {
        get : function(a) {
            var baseUrl = $window.sessionStorage.baseurl;
            //return $http.get(baseUrl+'/users?select={"name": 1,"_id":0,"email":1}');
            return $http.get('http://www.uiucwp.com:4000/api/tasks?select={"name":1,"_id":1,"assignedUser":1,"assignedUserName":1}&skip=0&limit=10&count=1');
        }
    }
});
mp4Services.factory('addTask', function($http, $window) {
    return {
        add : function(username, description_input, deadline_input, assignedUser_input) {
            var baseUrl = $window.sessionStorage.baseurl;
            //alert(a); // pass in name and email, check for errors too
            //alert(b);
            data = { name: username, description: description_input, deadline: deadline_input, assignedUserName: assignedUser_input }; // should have the assigned user id too?
            $http.post('http://www.uiucwp.com:4000/api/tasks', data).then(function()
                { alert("Task " + username + " Created");}, 
                function()
                {alert("Task Already Exists!");});
        }
    }
});

mp4Services.factory('addUser', function($http, $window) {
    return {
        add : function(a,b) {
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


