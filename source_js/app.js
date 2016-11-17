var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'FirstController'
  }).
  when('/edittask', {
    templateUrl: 'partials/edittask.html',
    controller: 'FirstController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'LlamaListController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'SecondController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'LlamaListController'
  }).
  when('/userdetails/:selectedUser', {
    templateUrl: 'partials/userdetails.html',
    controller: 'SecondController'
  }).
  when('/taskdetails', {
    templateUrl: 'partials/taskdetails.html',
    controller: 'SecondController'
  }).
  otherwise({
    redirectTo: '/settings',
    controller: 'LlamaListController'
  });
}]);
