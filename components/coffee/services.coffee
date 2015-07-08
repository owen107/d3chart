app.service 'dataService', [
  '$http'
  ($http) ->

    @getData = ->
      groupData = $http.get('data/access_group.json').success (data) ->
        data
      groupData
    return 
]