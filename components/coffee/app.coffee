app = angular.module('smarkApp', [
  'd3'
  'ngRoute'
])
app.config ($routeProvider) ->
  $routeProvider.when '/',
    templateUrl: 'views/home.html'
    controller: 'mainController'
  return