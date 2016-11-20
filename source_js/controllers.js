var mp4Controllers = angular.module('mp4Controllers', []);

// edit Task
mp4Controllers.controller('editTaskController', ['$scope', '$window', '$routeParams', 'work','getUserSpecific', 'ThegetTaskSpecific', 'getUsers', 'getPendingUserTask','updatePendingTasks' , function($scope, $window, $routeParams, work, getUserSpecific, ThegetTaskSpecific,  getUsers, getPendingUserTask, updatePendingTasks) {
  

  $scope.selectedSort = true;
  $scope.sorts = [true, false];
  $scope.taskPicked = $routeParams.selectedTask;
  console.log("shoul call the function");
  ThegetTaskSpecific.getIT($scope.taskPicked,"name").success(function(data){
    console.log("logginh name");
    $scope.name= _.chain(data.data).pluck('name').flatten().value().toString();
      });
    ThegetTaskSpecific.getIT($scope.taskPicked,"description").success(function(data){
    $scope.description= _.chain(data.data).pluck('description').flatten().value().toString();
      });
      ThegetTaskSpecific.getIT($scope.taskPicked,"deadline").success(function(data){
    $scope.deadline= _.chain(data.data).pluck('deadline').flatten().value().toString();
      });
    ThegetTaskSpecific.getIT($scope.taskPicked,"completed").success(function(data){
    $scope.completed= _.chain(data.data).pluck('completed').flatten().value().toString();
      });
    ThegetTaskSpecific.getIT($scope.taskPicked,"assignedUserName").success(function(data){
    $scope.assignedUserName= _.chain(data.data).pluck('assignedUserName').value().toString();
      });
    // get the users
    getUsers.get().success(function(data){
      console.log("in get users ");
        $scope.userList = data.data;
      });
    $scope.updateTheTask = function(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assignedUserID, task_completed)
    {
      work.doit(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assignedUserID, task_completed).success(function(data){
      $scope.thefuckingmsg = data.message;
      alert("the f*** message is " + $scope.thefuckingmsg);
      if (task_assignedUserName != "" ){
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
        $scope.userEmail = (_.chain(data.data).pluck('email').flatten().value().toString());
        console.log("the email is: " +$scope.userEmail);
        console.log("the email length: " +$scope.userEmail.length);
        updatePendingTasks.put(task_assignedUserName,  $scope.userEmail, assignedUserID,$scope.pendingTasks).success(function(data){
        $scope.msg2 = data.message;
        console.log("the final message is " + $scope.msg2);
      }).error(function(data){
        $scope.msg3 = data.message;
        console.log("the error message is " + $scope.msg3);
     
      // now do put request with new array
      console.log("doing put request");
    });
    });

      });
    }

    });
  }
 //error check
    // now if this works I need to add the new task to the user's pending who it was assigned to

  //$scope.name = $scope.taskPicked.name;

}]);




// Task List
mp4Controllers.controller('taskListController', ['$scope', '$http', '$window', 'getSortedTasks', 'deleteTask', 'getCount'  , function($scope, $window, $http, getSortedTasks, deleteTask, getCount) {
  $scope.resultsNumber = 0;
  $scope.YesOrNo = ["Yes", "No"];

  $scope.selectOrder = "1";
  $scope.completed = "false";
  $scope.selectedSort = "name";
  $scope.sorts = ["name", "assignedUserName", "dateCreated", "deadline"];
  $scope.countResults = 0;
    $scope.getAllTasks = function(a) {
      // check bounds
      if ($scope.resultsNumber < 0){
        a = 0;
        $scope.resultsNumber = 0;
      }
      // maybe have api call for each field needed? --> I do
      //alert("here");

      if ($scope.resultsNumber > $scope.countResults){
        $scope.resultsNumber -= 10;
        //alert("done");
        return;
      }
      getSortedTasks.get(parseInt(a), $scope.completed, $scope.selectOrder, $scope.selectedSort).success(function(data){
      $scope.tasks = data.data;
      getCount.get(parseInt(a), $scope.completed, $scope.selectOrder, $scope.selectedSort).success(function(data){
        $scope.countResults = data.data;
        console.log("countResults is " + $scope.countResults);
        });
    })};
    $scope.getAllTasks($scope.resultsNumber);
    $scope.getPrevTasks = function(){
      $scope.resultsNumber-= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };
    $scope.getNextTasks = function(){
      if( $scope.resultsNumber > $scope.countResults){
        //alert("cant incrase");
        return;}
      $scope.resultsNumber+= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };
    $scope.getNewResults = function(){
      console.log("updating list");
      $scope.getAllTasks($scope.resultsNumber);
    };


    $scope.deleteTheTask = function(a){
      deleteTask.delete(a).success(function(data){
        $scope.getAllTasks();
      });
    };
  $scope.pickTask = function(task_id){
    //alert(user_id);
    $scope.selectedTask = task_id;
  }


}]);


// User Details
mp4Controllers.controller('userDetails', ['$scope', '$http' , '$window', '$routeParams','addUser', 'getUser', 'getTask' ,'showTheCompletedTasks', 'work', 'updatePendingTasks' ,function($scope, $http, $window, $routeParams, addUser,  getUser, getTask, showTheCompletedTasks, work, updatePendingTasks) {
  $scope.added = "";
  $scope.deadlines = [];
  $scope.taskID = [];
  $scope.bsNAMES = [];
  $scope.descriptionVal = [];
  $scope.buttonClicked = false;
  //$scope.userPicked = $routeParams.selectedUser;
  
  $scope.theUserInfo = function(){
    getUser.get($routeParams.selectedUser).success(function(data){
        $scope.userPicked = data.data;
      })};
  $scope.theUserInfo();
    /*  $scope.getAllUsers = function() {
      getUsers.get().success(function(data){
        $scope.users = data.data;
      })};*/

  // have function to get the user from the _id in the selectedUser
  // name and email and list of pending tasks
  // have button to complete the task and make api call to refresh view (like delete)
  // Show completed tasks, api call 
  // Each click makes api call

  $scope.getTaskNames = function(task_ids){
        //alert("called");
        console.log(task_ids.length);
        for (i = 0; i < task_ids.length; i ++){
        console.log("in loop" + task_ids[i]);
        getTask.get(task_ids[i]).success(function(data){
          console.log("Adding the following: " + _.chain(data.data).pluck('name').flatten().value().toString());
          $scope.bsNAMES.push(_.chain(data.data).pluck('name').flatten().value().toString());
          $scope.deadlines.push(_.chain(data.data).pluck('deadline').flatten().value().toString());
          $scope.taskID.push(_.chain(data.data).pluck('_id').flatten().value().toString());
          $scope.descriptionVal.push(_.chain(data.data).pluck('description').flatten().value().toString());
          console.log("the len of deadlines is "+ $scope.deadlines.length);
          console.log("the len of taskID is "+ $scope.taskID.length);
          console.log("the len of bsNAMES is "+ $scope.bsNAMES.length);
        });  
      }
  }
  $scope.markAsCompleted = function(taskID,taskname,taskDesc, taskDeadline, UserName, userEmail, userPendingTasks){
    console.log(userPendingTasks.length);
    // api put call 
    // keep all the same just change completed to true
    // task_id, task_name, task_desc, task_deadline, task_assignedUserName, assingedUserID, task_completed
    work.doit(taskID, taskname, taskDesc, taskDeadline, UserName, $routeParams.selectedUser, true).success(function(data){
      $scope.response = data.message;
      console.log($scope.response);
      // now update user pending
      // userName, userEmail, userID, pendingTasksUpdated
      // first find the element and remove the element from the array
      var index = userPendingTasks.indexOf(taskID);
      if (index > -1){
        userPendingTasks.splice(index,1);
        //newArray = userPendingTasks;
      }
        console.log("the new array len is " + userPendingTasks.length);
      //userName, userEmail, userID, pendingTasksUpdated
      updatePendingTasks.put(UserName, userEmail, $routeParams.selectedUser, userPendingTasks).success(function(data){
       $scope.response2 = data.message;
        console.log($scope.response2);
        // now reload the pending tasks
       $scope.theUserInfo();
      });
    });
  }

  $scope.showCompleted = function(){
    // api call to get the completed tasks
    console.log($routeParams.selectedUser);
    showTheCompletedTasks.get($routeParams.selectedUser).success(function(data){
      $scope.completedTasks = data.data;
      console.log("in showCompleted");
      $scope.buttonClicked = true;
    })
  }

}]);


// Task Details
mp4Controllers.controller('taskDetails', ['$scope', '$http', '$window','$routeParams','addUser', 'getUser', 'getTask', function($scope, $http,$window, $routeParams, addUser, getUser, getTask) {
  $scope.taskPicked = $routeParams.selectedTask;
  getTask.get($scope.taskPicked).success(function(data){
        $scope.taskPicked = data.data;
      });

}]);


mp4Controllers.controller('userListController', ['$scope', '$http', '$window', 'getUsers', 'deleteUser', 'addTask','getUser' , function($scope, $http, $window, getUsers, deleteUser, addTask, getUser ) {

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
mp4Controllers.controller('addTaskController', ['$scope', '$http', '$window' ,'getUsers', 'deleteUser', 'addTask','getPendingUserTask', 'getUserSpecific','updatePendingTasks',   function($scope, $http, $window, getUsers, deleteUser, addTask, getPendingUserTask, getUserSpecific, updatePendingTasks) {

//$scope.userEmail= [];
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
        $scope.userEmail = (_.chain(data.data).pluck('email').flatten().value().toString());
        console.log("the email is: " +$scope.userEmail);
        console.log("the email length: " +$scope.userEmail.length);

     
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
