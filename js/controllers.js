app.controller('mainController', [
  '$scope', 'dataService', function($scope, dataService) {
    return dataService.getData().then(function(data) {
      return $scope.groupData = data.data;
    });
  }
]);
