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
    $scope.deadline= _.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0];
      });
    ThegetTaskSpecific.getIT($scope.taskPicked,"completed").success(function(data){
    $scope.completed= _.chain(data.data).pluck('completed').flatten().value().toString();
      });
    ThegetTaskSpecific.getIT($scope.taskPicked,"assignedUserName").success(function(data){
    $scope.assignedUserNameOriginal= _.chain(data.data).pluck('assignedUserName').value().toString();
      });
        ThegetTaskSpecific.getIT($scope.taskPicked,"assignedUser").success(function(data){
    $scope.assignedUser= _.chain(data.data).pluck('assignedUser').value().toString();
      });
    // get the users
    getUsers.get().success(function(data){
      console.log("in get users ");
        $scope.userList = data.data;
      });
    $scope.updateTheTask = function(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assignedUserID, task_completed)
    {
      if( task_assignedUserName == undefined){
        console.log("user not changed");
        task_assignedUserName = $scope.assignedUserNameOriginal;
        assignedUserID = $scope.assignedUser;
      }
      work.doit(task_id, task_name, task_desc, task_deadline, task_assignedUserName, assignedUserID, task_completed).success(function(data){
          alert(data.message);
          if (task_assignedUserName != "" ){
            // make api call to get the user's pending tasks
            // append this new task_id (how to get it? -> by getting all tasks assigned to the user)
            // put request on new pending tasks
            console.log("getting the pending");
            getPendingUserTask.get(assignedUserID).success(function(data){
              console.log("after the getPendingUserTask");
              $scope.pendingTasks = data.data;
            // first get user email
            console.log("getting the email");
            getUserSpecific.get(assignedUserID,"email").success(function(data){
            console.log("works Useremail");
            $scope.userEmail = (_.chain(data.data).pluck('email').flatten().value().toString());
            updatePendingTasks.put(task_assignedUserName,  $scope.userEmail, assignedUserID,$scope.pendingTasks).success(function(data){
          }).error(function(data){
            alert(data.message);
        });
        });

          });
        }

        }).error(function(data){
            alert(data.message);
        });
    }
}]);


// Task List
mp4Controllers.controller('taskListController', ['$scope', '$http', '$window', 'getSortedTasks', 'deleteTask', 'getCount' , 'ThegetTaskSpecific' ,'getUserSpecific','getPendingUserTask', 'updatePendingTasks', function($scope, $window, $http, getSortedTasks, deleteTask, getCount,ThegetTaskSpecific, getUserSpecific, getPendingUserTask,updatePendingTasks) {
  $scope.resultsNumber = 0;
  $scope.YesOrNo = ["Yes", "No"];

  $scope.taskCompleted;
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
      console.log("the resultsNumber is " + $scope.resultsNumber);
      getSortedTasks.get(parseInt(a), $scope.completed, $scope.selectOrder, $scope.selectedSort).success(function(data){
        $scope.tasks = data.data;
        console.log("before calling getCount, val is: " + $scope.completed);
        getCount.get($scope.completed).success(function(data){
            console.log("back from getCount");
          $scope.countResults = data.data;
        console.log("after get count , $scope.countResults is " + $scope.countResults);
        }).error(function(data){
            //alert(data.message);
        });
    })};
    $scope.getAllTasks($scope.resultsNumber);
    $scope.getPrevTasks = function(){
      $scope.resultsNumber-= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };
    $scope.getNextTasks = function(){
        console.log("In get next tasks, $scope.resultsNumber is " + $scope.resultsNumber);
      if( $scope.resultsNumber > $scope.countResults){
        return;
      }
      $scope.resultsNumber+= 10;
      $scope.getAllTasks($scope.resultsNumber);
    };
    $scope.getNewResults = function(){
      console.log("updating list");
      $scope.getAllTasks($scope.resultsNumber);
    };

    $scope.deleteTheTask = function(task_id, taskAssignedUserName, taskAssignedUserID){
      // check if the task is completed or if user == unassigned or userid = ""
      // first get if the task is completed
     ThegetTaskSpecific.getIT(task_id,"completed").success(function(data){
        $scope.taskCompleted = (_.chain(data.data).pluck('completed').flatten().value().toString());
        // some edge guesses ?
        if ($scope.taskCompleted == "true" || taskAssignedUserName == "unassigned" || taskAssignedUserID == "" ||
                                            taskAssignedUserName == undefined || taskAssignedUserID == undefined  ){
          console.log("Just straight up delete it since its completed or user is unassigned");
          deleteTask.delete(task_id).success(function(data){
            $scope.getAllTasks();
          }).error(function(data){
            alert(data.message);
          });
          return;
        }
        // get the user pending tasks
        //remove task_id from it 
        // put api request with new pending tasks (need userEmail)
        console.log("looks like some more work needs to be done");
        getUserSpecific.get(taskAssignedUserID,"email").success(function(data){
          console.log("got the user email");
          $scope.userEmail = (_.chain(data.data).pluck('email').flatten().value().toString());
          // get user pending tasks
          getPendingUserTask.get(taskAssignedUserID).success(function(data){
            $scope.pendingTasks = (_.chain(data.data).pluck('_id').flatten().value().toString().split(','));
             var index = $scope.pendingTasks.indexOf(task_id);
              if (index > -1){
                $scope.pendingTasks.splice(index,1);
                //newArray = userPendingTasks;
              }
              updatePendingTasks.put(taskAssignedUserName,$scope.userEmail,taskAssignedUserID,$scope.pendingTasks).success(function(data){
              });
          });
        });
        deleteTask.delete(task_id).success(function(data){
          $scope.getAllTasks();
        }).error(function(data){
            alert(message.data);
        });
      });
    };
  $scope.pickTask = function(task_id){
    //console.log(task_id);
    $scope.selectedTask = task_id;
  }
}]);


// User Details
mp4Controllers.controller('userDetails', ['$scope', '$http' , '$window', '$routeParams','addUser', 'getUser', 'getTask' ,'showTheCompletedTasks', 'work', 'updatePendingTasks' ,function($scope, $http, $window, $routeParams, addUser,  getUser, getTask, showTheCompletedTasks, work, updatePendingTasks) {
  $scope.added = "";
  $scope.buttonClicked = false;
  
  $scope.theUserInfo = function(){
    getUser.get($routeParams.selectedUser).success(function(data){
        $scope.userPicked = data.data;
        $scope.getTaskNames(_.chain(data.data).pluck('pendingTasks').flatten().value().toString().split(','));
      })};
  $scope.theUserInfo();
  // have function to get the user from the _id in the selectedUser
  // name and email and list of pending tasks
  // have button to complete the task and make api call to refresh view (like delete)
  // Show completed tasks, api call 
  // Each click makes api call

    $scope.pickTask = function(task_id){
    console.log("the task id is " + task_id);
    $scope.selectedTask = task_id;
  }

  $scope.getTaskNames = function(task_ids){
        $scope.deadlines = [];
        $scope.taskID = [];
        $scope.bsNAMES = [];
        $scope.descriptionVal = [];
        console.log(task_ids.length);
        for (i = 0; i < task_ids.length; i ++){
        console.log("in loop" + task_ids[i]);
        getTask.get(task_ids[i]).success(function(data){
          console.log("Adding the following: " + _.chain(data.data).pluck('name').flatten().value().toString());
          $scope.bsNAMES.push(_.chain(data.data).pluck('name').flatten().value().toString());
          $scope.deadlines.push(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
          alert(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
          $scope.taskID.push(_.chain(data.data).pluck('_id').flatten().value().toString());
          $scope.descriptionVal.push(_.chain(data.data).pluck('description').flatten().value().toString());
        });  
      }
  }
  $scope.markAsCompleted = function(taskID,taskname,taskDesc, taskDeadline, UserName, userEmail, userPendingTasks){
    // api put call 
    // keep all the same just change completed to true
    // task_id, task_name, task_desc, task_deadline, task_assignedUserName, assingedUserID, task_completed
    work.doit(taskID, taskname, taskDesc, taskDeadline, UserName, $routeParams.selectedUser, true).success(function(data){
      $scope.response = data.message;
      console.log($scope.response);
      // now update user pending
      // first find the element and remove the element from the array
      var index = userPendingTasks.indexOf(taskID);
      if (index > -1){
        userPendingTasks.splice(index,1);
        //newArray = userPendingTasks;
      }
      updatePendingTasks.put(UserName, userEmail, $routeParams.selectedUser, userPendingTasks).success(function(data){
       $scope.response2 = data.message;
        console.log($scope.response2);
        // now reload the pending tasks
       $scope.theUserInfo();
      });
    });
  }
    $scope.deadlineExact;
  $scope.showCompleted = function(){
    // api call to get the completed tasks
    showTheCompletedTasks.get($routeParams.selectedUser).success(function(data){
      $scope.completedTasks = data.data; 
      //alert(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
      //$scope.deadlines23.push(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
      $scope.buttonClicked = true;
    })
  }

}]);


// Task Details
mp4Controllers.controller('taskDetails', ['$scope', '$http', '$window','$routeParams','addUser', 'getUser', 'getTask', function($scope, $http,$window, $routeParams, addUser, getUser, getTask) {
  $scope.taskPicked = $routeParams.selectedTask;
  getTask.get($scope.taskPicked).success(function(data){
        $scope.taskPicked = data.data;
      }).error(function(data){
        alert(data.message);
      });

}]);

// user list
mp4Controllers.controller('userListController', ['$scope', '$http', '$window', 'getUsers', 'deleteUser', 'addTask','getUser', 'getPendingUserTask', 'workSpecial' ,'getTaskString' , function($scope, $http, $window, getUsers, deleteUser, addTask, getUser, getPendingUserTask, workSpecial, getTaskString ) {

  $scope.getAllUsers = function() {
      getUsers.get().success(function(data){
        $scope.users = data.data;
      })};

  $scope.myArray = [];
  $scope.getAllUsers();
  var task_desc = [];
  var task_name = [];
  var task_deadline = [];
  var task_completed = false;
  var task_new_user = "unassigned";
  $scope.deleteTheUser = function (userID){
    // must go through the pending tasks and change tasks to unassigned 
    // then delete user 
    // first get the user pending tasks
    getPendingUserTask.get(userID).success(function(data){
      $scope.pendingTasks = _.chain(data.data).pluck('_id').flatten().value().toString().split(',');
      console.log($scope.pendingTasks.length);
      console.log(JSON.stringify($scope.pendingTasks[0]));
      // put api request call for every task with name unassigned
      for (i = 0; i<$scope.pendingTasks.length; i++){
        //console.log("the val of i is " + i);
        console.log("in for loop");
        $scope.myArray.push(JSON.stringify($scope.pendingTasks[i]));
        getTaskString.get(JSON.stringify($scope.pendingTasks[i])).success(function(data){
          console.log("done with getTaskString");
           task_desc.push(_.chain(data.data).pluck('description').flatten().value().toString());
           task_name.push(_.chain(data.data).pluck('name').flatten().value().toString());
           task_deadline.push(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
           alert(_.chain(data.data).pluck('deadline').flatten().value().toString().split("T")[0]);
           task_new_user = "unassigned";
          for(i = 0; i <$scope.pendingTasks.length; i++){
            workSpecial.doit(JSON.stringify($scope.pendingTasks[i]).replace(/\"/g, ""),task_name[i], task_desc[i], task_deadline[i],task_new_user[i], -999, false ).success(function(data){
              console.log("Task should be updated");
          });
          }
        });
        }
        });
      deleteUser.delete(userID).success(function(data){
      $scope.getAllUsers();
    }).error(function(data){
        alert(data.message);
    });
  
  };
  $scope.pickUser = function(user_id){
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
        alert(data.message);
        if (assignedUser != "" ){
            // make api call to get the user's pending tasks
            // append this new task_id (how to get it? -> by getting all tasks assigned to the user)
            // put request on new pending tasks
            console.log("getting the pending");
            getPendingUserTask.get(assignedUserID).success(function(data)
            {
                console.log("after the getPendingUserTask");
                $scope.pendingTasks = data.data;
                // first get user email
                getUserSpecific.get(assignedUserID,"email").success(function(data)
                {
                    $scope.userEmail = (_.chain(data.data).pluck('email').flatten().value().toString());
                    // now do put request with new array
                    console.log("doing put request");
                    updatePendingTasks.put(assignedUser,  $scope.userEmail, assignedUserID,$scope.pendingTasks).success(function(data)
                    {
                        $scope.msg2 = data.message;
                        console.log("the final message is " + $scope.msg2);
                    }).error(function(data){
                        alert(data.message);
                    }); 
                });
            });
        }
            }).error(function(data){
                alert(data.message);
            });
    };

  $scope.getAllUsers();
}]);

// Add a user
mp4Controllers.controller('AddUserController', ['$scope' , '$window' ,'$routeParams','addUser', function($scope, $window, $routeParams, addUser) {

  $scope.addTheUser = function(a,b){
    addUser.add(a,b).success(function(data){
      alert(data.message);
    })
    .error(function(data){
      alert(data.message);
    }); //need error check
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
