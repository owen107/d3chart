app.controller('mainController', [
  '$scope', 'dataService', function($scope, dataService) {
    dataService.getData().then(function(data) {
      $scope.groupData = data.data;
    });
  }
]);
