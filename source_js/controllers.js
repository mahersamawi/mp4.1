var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('FirstController', ['$scope', '$http', 'CommonData', 'getTasks', 'deleteTask', 'getCount' ,'$window'  , function($scope, $http, CommonData, getTasks, deleteTask, getCount, $window) {
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

mp4Controllers.controller('SecondController', ['$scope', '$http' ,'CommonData' , '$routeParams','addUser', '$window', function($scope, $http, addUser, $routeParams, CommonData, $window) {
  $scope.data = "";
  $scope.added = "";
  alert(String($routeParams.selectedUser));
  $scope.userPicked = $routeParams.selectedUser;
  $scope.getData = function(){
    $scope.data = CommonData.getData();
  };
  // have function to get the user from the _id in the selectedUser
  // name and email and list of pending tasks
  // have button to complete the task and make api call to refresh view (like delete)
  // Show completed tasks, api call 
  // Each click makes api call

  $scope.addTheUser = function(a,b){
    addUser.add(a,b); //need error check
  };

}]);


mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'getUsers', 'deleteUser', 'addTask','$window' , function($scope, $http,  getUsers, deleteUser, addTask, $window) {

  $scope.pickUser = function(a){
    alert(a);
      $scope.selectedUser = a;
  }
  $scope.getAllUsers = function() {
      getUsers.get().success(function(data){
        $scope.users = data.data;
      })};

  $scope.addTheTask = function(username, description, deadline, assignedUser){
    addTask.add(username, description, deadline, assignedUser); //error check
  };

  $scope.getAllUsers();
  $scope.deleteTheUser = function (a){
    deleteUser.delete(a).success(function(data){
    $scope.getAllUsers();
    });

  };


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
