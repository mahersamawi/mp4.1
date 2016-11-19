var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'taskListController'
  }).
  when('/edittask/:selectedTask', {
    templateUrl: 'partials/edittask.html',
    controller: 'editTaskController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'userListController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'addTaskController'
  }).
  when('/userdetails/:selectedUser', {
    templateUrl: 'partials/userdetails.html',
    controller: 'userDetails'
  }).
  when('/taskdetails/:selectedTask', {
    templateUrl: 'partials/taskdetails.html',
    controller: 'taskDetails'
  }).
  otherwise({
    redirectTo: '/settings',
    controller: 'SettingsController'
  });
}]);
