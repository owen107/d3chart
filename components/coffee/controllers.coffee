app.controller 'mainController', [
  '$scope'
  'dataService'
  ($scope, dataService) ->
    dataService.getData().then (data) ->
      $scope.groupData = data.data 
]