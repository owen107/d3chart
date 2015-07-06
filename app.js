var app = angular.module('smarkApp', ['d3']);

app.controller('mainCtrl', ['$scope', function($scope) {
	 
	 $scope.groupData = [
	    {  
	       name: "Access Group 1",
	       low: 290,
	       med: 415,
	       high: 295
	    },{
	       name: "Access Group 2",
	       low: 250,
	       med: 350,
	       high: 260
	    },{
	       name: "Access Group 3",
	       low: 220,
	       med: 330,
	       high: 230
	    },{
	       name: "Access Group 4",
	       low: 240,
	       med: 350,
	       high: 220
	    },{
	       name: "Access Group 5",
	       low: 250,
	       med: 355,
	       high: 305
	    },{
	       name: "Access Group 6",
	       low: 235,
	       med: 400,
	       high: 205
	    },{
	       name: "Access Group 7",
	       low: 260,
	       med: 310,
	       high: 285
	    },{
	       name: "Access Group 8",
	       low: 280,
	       med: 400,
	       high: 295
	    }
	 ];
}]);

app.directive('stackedBar', ['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service) {
    
    return {
    	restrict: 'E',
    	scope: {
    		data: '='
    	},
    	link: function(scope, elem, attrs) {

    		d3Service.d3().then(function(d3) {
	          
	          var margin = {top: 25, right: 5, bottom: 15, left: 5},
		          width = 800 - margin.left - margin.right,
			      height = 600 - margin.top - margin.bottom,
			      headers = ['Low Activity', 'Med Activity', 'High Activity'];

			  var yScale = d3.scale.ordinal()
			      .rangeRoundBands([0, height], .5);
  
			  var xScale = d3.scale.linear()
			      .rangeRound([0, width]);
  
			  var colors = d3.scale.ordinal()
			      .domain(headers)
			      .range(["#9ecae1", "#6baed6", "#3182bd"]);
  
			  var xAxis = d3.svg.axis()
			      .scale(xScale)
			      .orient("top");
  
			  var yAxis = d3.svg.axis()
			      .scale(yScale)
			      .orient("left");
              
              var svg = d3.select(elem[0]).append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .attr('id', 'stacked-bar')
                .append('g')
                  // .attr('transform', 'translate(' + margin.left + margin.top + ')');
			      
		      var layers = d3.layout.stack()(['low', 'med', 'high'].map(function(level) {
		      	   return scope.data.map(function(d) {
		      	   	   return { 
		      	   	   	   x: d.name, 
		      	   	   	   y: +d[level] 
		      	   	   };
		      	   }); 
		      }));

		      console.log(layers);

		      // set up the x-domain and y-domain
		      xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { 
			  	    return d.y0 + d.y;
			  })]);

			  yScale.domain(layers[0].map(function(d) {
			  	    return d.x; 
			  }));

			  // Add a group element for each access group.
			  var groups = svg.selectAll(".group")
			      .data(layers)
			      .enter().append("g")
			      .attr("class", "group")
			      .style("fill", function(d, i) { 
			      	  return colors(i); 
			      });
			      // .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

			  var rects = groups.selectAll("rect")
		          .data(function(d) { 
		          	// console.log(d);
		          	return d; 
		          })
		          .enter().append("rect")
		          .attr("x", function(d) {
		          	  console.log(d);
		          	  return xScale(d.y0);
		          })
		          .attr("y", function(d) { 
		          	  return yScale(d.x); 
		          })
		          .attr("height", yScale.rangeBand())
		          .attr("width", function(d) {
                       return xScale(d.y);
		          })
		          .on("click", function(d) {
		               console.log(d.y);
		          });
	              


			});
	    }
	};

}]);

