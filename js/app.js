var app;

app = angular.module('smarkApp', ['d3', 'ngRoute']);

app.config(function($routeProvider) {
  return $routeProvider.when('/', {
    templateUrl: 'views/home.html',
    controller: 'mainController'
  });
});
