angular.module('d3', []).factory 'd3Service', [
  '$document'
  '$window'
  '$q'
  '$rootScope'
  ($document, $window, $q, $rootScope) ->
    d = $q.defer()
    d3service = d3: ->
      d.promise
    scriptTag = $document[0].createElement('script')

    onScriptLoad = ->
      # Load client in the browser
      $rootScope.$apply ->
        d.resolve $window.d3

    scriptTag.type = 'text/javascript'
    scriptTag.async = true
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'

    scriptTag.onreadystatechange = ->
      if @readyState == 'complete'
        onScriptLoad()

    scriptTag.onload = onScriptLoad
    s = $document[0].getElementsByTagName('body')[0]
    s.appendChild scriptTag
    d3service
]

