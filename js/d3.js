angular.module('d3', []).factory('d3Service', [
  '$document', '$window', '$q', '$rootScope', function($document, $window, $q, $rootScope) {
    var d, d3service, onScriptLoad, s, scriptTag;
    d = $q.defer();
    d3service = {
      d3: function() {
        return d.promise;
      }
    };
    scriptTag = $document[0].createElement('script');
    onScriptLoad = function() {
      $rootScope.$apply(function() {
        d.resolve($window.d3);
      });
    };
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js';
    scriptTag.onreadystatechange = function() {
      if (this.readyState === 'complete') {
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;
    s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    return d3service;
  }
]);
