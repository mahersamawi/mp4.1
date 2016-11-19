var mp4Controllers = angular.module('mp4Controllers', []);

// edit Task
mp4Controllers.controller('editTaskListController', ['$scope', '$http', 'CommonData', 'getTasks', 'deleteTask', 'getCount' ,'$window'  , function($scope, $http, CommonData, getTasks, deleteTask, getCount, $window) {
  $scope.data = "";
  $scope.displayText = ""
  $scope.resultsNumber = 0;
}]);




// Task List
mp4Controllers.controller('taskListController', ['$scope', '$http', 'CommonData', 'getTasks', 'deleteTask', 'getCount' ,'$window'  , function($scope, $http, CommonData, getTasks, deleteTask, getCount, $window) {
  $scope.data = "";
  $scope.displayText = ""
  $scope.resultsNumber = 0;

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"
  };
    $scope.getAllTasks = function(a) {
      // check bounds
      if (parseInt(a) < 0){
        a = 0;
        $scope.resultsNumber = 0;
      }
      getTasks.get(parseInt(a)).success(function(data){
      $scope.tasks = data.data;
    })};
    $scope.selectedSort = "name";
    $scope.sorts = ["name", "assignedUserName", "dateCreated", "deadline"];
    $scope.selectedOrder = false;
    $scope.getCountResults = function() {
      return getCount.get().success(function(data){
        return data.data;
        });
      };
    $scope.getAllTasks($scope.resultsNumber);
    $scope.getPrevTasks = function(){
      $scope.resultsNumber-= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };
    $scope.getNextTasks = function(){
      $scope.resultsNumber+= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };


    $scope.deleteTheTask = function(a){
      deleteTask.delete(a).success(function(data){
        $scope.getAllTasks();
      });
    };

  $scope.YesOrNo = ["Yes", "No"];
}]);


// User Details
mp4Controllers.controller('userDetails', ['$scope', '$http' ,'CommonData' , '$routeParams','addUser', 'getUser', 'getTask','$window', function($scope, $http, addUser, $routeParams, CommonData, getUser, getTask, $window) {
  $scope.data = "";
  $scope.added = "";
  $scope.taskNames = [];
  $scope.deadlines = [];
  $scope.taskID = [];
  $scope.buttonClicked = false;
  $scope.userPicked = $routeParams.selectedUser;
  $scope.getData = function(){
    $scope.data = CommonData.getData();
  };
  getUser.get($scope.userPicked).success(function(data){
        $scope.userPicked = data.data;
      });

  // have function to get the user from the _id in the selectedUser
  // name and email and list of pending tasks
  // have button to complete the task and make api call to refresh view (like delete)
  // Show completed tasks, api call 
  // Each click makes api call

  $scope.getTaskNames = function(task_ids){
    // make get call
    getTask.get(task_ids).success(function(data){
      //alert("here");
      $scope.taskNames.push(_.chain(data.data).pluck('name').flatten().value().toString());
      $scope.deadlines.push(_.chain(data.data).pluck('deadline').flatten().value().toString());
      $scope.taskID.push(_.chain(data.data).pluck('_id').flatten().value().toString());
      console.log($scope.taskNames.length);
    });
  }
  $scope.showCompleted = function(){
    // api call to get the completed tasks
    $scope.buttonClicked = true;
  }

}]);



// Task Details
mp4Controllers.controller('taskDetails', ['$scope', '$http' ,'CommonData' , '$routeParams','addUser', 'getUser', 'getTask','$window', function($scope, $http, addUser, $routeParams, CommonData, getUser, getTask, $window) {

}]);


mp4Controllers.controller('userListController', ['$scope', '$http', 'getUsers', 'deleteUser', 'addTask','getUser', '$window' , function($scope, $http,  getUsers, deleteUser, addTask, getUser, $window) {

  $scope.getAllUsers = function() {
      getUsers.get().success(function(data){
        $scope.users = data.data;
      })};

  $scope.getAllUsers();
  $scope.deleteTheUser = function (a){
    deleteUser.delete(a).success(function(data){
    $scope.getAllUsers();
    });
  };
  $scope.pickUser = function(user_id){
    //alert(user_id);
    $scope.selectedUser = user_id;
  }
}]);


// Add a Task
mp4Controllers.controller('addTaskController', ['$scope', '$http', 'getUsers', 'deleteUser', 'addTask','getPendingUserTask', 'getUserSpecific','updatePendingTasks',  '$window' , function($scope, $http,  getUsers, deleteUser, addTask, getPendingUserTask, getUserSpecific, updatePendingTasks, $window) {

$scope.userEmail= [];
  $scope.getAllUsers = function() {
      getUsers.get().success(function(data){
        $scope.users = data.data;
      })};

  $scope.addTheTask = function(username, description, deadline, assignedUser, assignedUserID){
    addTask.add(username, description, deadline, assignedUser, assignedUserID).success(function(data){
    $scope.msg = data.message;
    console.log($scope.msg);
    if (assignedUser != "" ){
      // make api call to get the user's pending tasks
      // append this new task_id (how to get it? -> by getting all tasks assigned to the user)
      // put request on new pending tasks
      console.log("getting the pending");
      getPendingUserTask.get(assignedUserID).success(function(data){
        console.log("after the getPendingUserTask");
        $scope.pendingTasks = data.data;
      
      console.log("out");
      console.log($scope.pendingTasks.length);
      console.log($scope.pendingTasks[3]);
      // first get user email
      console.log("getting the email");
      getUserSpecific.get(assignedUserID,"email").success(function(data){
        console.log("works Useremail");
        $scope.userEmail.push(_.chain(data.data).pluck('email').flatten().value().toString());
        console.log($scope.userEmail);
     
      // now do put request with new array
      console.log("doing put request");
      updatePendingTasks.put(assignedUser,  $scope.userEmail, assignedUserID,$scope.pendingTasks).success(function(data){
        $scope.msg2 = data.message;
        console.log("the final message is " + $scope.msg2);
      }).error(function(data){
        $scope.msg3 = data.message;
        console.log("the error message is " + $scope.msg3);
      }); // error check
      });
       });
    }
    }); //error check
    // now if this works I need to add the new task to the user's pending who it was assigned to


  };

  $scope.getAllUsers();
}]);

// Add a user
mp4Controllers.controller('AddUserController', ['$scope' , '$window' ,'$routeParams','addUser', function($scope, $window, $routeParams, addUser) {

  $scope.addTheUser = function(a,b){
    addUser.add(a,b); //need error check
  };
}]);



// Settings
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
