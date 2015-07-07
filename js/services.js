app.service('dataService', [
  '$http', function($http) {
    this.getData = function() {
      var groupData;
      groupData = $http.get('data/access_group.json').success(function(data) {
        return data;
      });
      return groupData;
    };
  }
]);
