app.directive('stackedBar', ['d3Service', function(d3Service) {
    
    return {
    	restrict: 'E',
    	scope: {
    		data: '='
    	},
    	link: function(scope, elem, attrs) {

    		d3Service.d3().then(function(d3) {
	          
	          var margin = {top: 55, right: 25, bottom: 15, left: 125},
		          width = 800 - margin.left - margin.right,
			      height = 550 - margin.top - margin.bottom,
			      headers = ['Low Activity', 'Med Activity', 'High Activity'],
			      tempColor;

			  var yScale = d3.scale.ordinal()
			      .rangeRoundBands([0, height], .66, 0.2);
  
			  var xScale = d3.scale.linear()
			      .rangeRound([0, width]);

			  var xScale2 = d3.scale.linear()
			      .rangeRound([0, width]);
  
			  var colors = d3.scale.ordinal()
			      .domain(headers)
			      .range(["#9ecae1", "#6baed6", "#3182bd"]);
  
			  var xAxis = d3.svg.axis()
			      .scale(xScale)
			      .tickSize(-height)
                  .tickPadding(8)
			      .orient("top");

			  var xAxis2 = d3.svg.axis()
			      .scale(xScale2)
			      .orient('top')
  
			  var yAxis = d3.svg.axis()
			      .scale(yScale)
			      .outerTickSize(0)
			      .tickPadding(5)
			      .orient("left");
              
              var svg = d3.select(elem[0]).append('svg')
                  // .attr('width', width + margin.left + margin.right)
                  // .attr('height', height + margin.top + margin.bottom)
                  .attr("preserveAspectRatio", "xMinYMin meet")
                  .attr("viewBox", "0 0 800 550")
                  .attr('id', 'stacked-bar')
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

              var toolTip = d3.select('body').append('div')
		          .style('position', 'absolute')
		          .style('padding', '10px 15px')
		          .style('border-radius', '5px')
		          .style('background', '#ccc')
		          .style('fill', '#000')
		          .style('opacity', 0);
			      
		      var layers = d3.layout.stack()(['low', 'med', 'high'].map(function(level) {
		      	   return scope.data.map(function(d) {
		      	   	   return { 
		      	   	   	   x: d.name, 
		      	   	   	   y: +d[level] 
		      	   	   };
		      	   }); 
		      }));

		      // set up the x-domain and y-domain
		      xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { 
			  	    return d.y0 + d.y;
			  })]);

			  xScale2.domain([0, d3.max(layers[layers.length - 1], function(d) { 
			  	    return (d.y0 + d.y) / 10;
			  })]);

			  yScale.domain(layers[0].map(function(d) {
			  	    return d.x; 
			  }));
	          
	          var hAxis = svg.append('g')
	               .attr('class', 'x-axis')
	               .attr('transform', 'translate(0, 0)')
	               .call(xAxis);

	          hAxis.append('text')
	               .style('font-size', '12px')
	               .attr('transform', 'translate('+ (width - 43) + ', -28)')
	               .text('# of Members');

	          var hAxis2 = svg.append('g')
	               .attr('class', 'x-axis2')
	               .attr('transform', 'translate(0, ' + (height-40) + ')')
	               .call(xAxis2);

	          hAxis.append('text')
	               .style('font-size', '12px')
	               .attr('transform', 'translate('+ (width + 15) + ', ' + (height - 50) + ')')
	               .text('%');

	          var vAxis = svg.append('g')
	               .attr('class', 'y-axis')
	               .call(yAxis);

	          hAxis.selectAll("path")
			     .style({"fill": "none", "stroke": "none"});

			  hAxis2.selectAll("path")
			     .style({"fill": "none", "stroke": "none"});

		      hAxis.selectAll("line")
		         .style("fill", "none")
		         .style("stroke", "#000")
		         .style('stroke-opacity', 0.15)
		         .style("shape-rendering", "crispEdges");
			       
		      hAxis.selectAll('.tick text')
		         .style('font-size', '13px')
		         .style('fill', '#c2c2c2');

		      hAxis2.selectAll('.tick text')
		         .style('font-size', '13px')
		         .style('fill', '#c2c2c2');

			  vAxis.selectAll("path")
			     .style("fill", "none")
			     .style("stroke", "#000")
			     .style("shape-rendering", "crispEdges")
		      
		      vAxis.selectAll("line")
		         .style("fill", "none")
		         .style("stroke", "#000")
		         .style("shape-rendering", "crispEdges")
			       
			  vAxis.selectAll('text')
			      .style('font-size', '12.5px');

			  // Add a group element for each access group.
			  var groups = svg.selectAll(".group")
			      .data(layers)
			      .enter().append("g")
			      .attr("class", "group")
			      .style("fill", function(d, i) { 
			      	  return colors(i); 
			      });

			  var rects = groups.selectAll("rect")
		          .data(function(d) { 
		          	return d; 
		          })
		          .enter().append("rect")
		          .attr("x", 0)
		          .attr("width", 0)
		          .attr("y", function(d) { 
		          	  return yScale(d.x); 
		          })
		          .attr("height", yScale.rangeBand())
		          .on('mouseover', function(d) {
                  
				    toolTip.transition()
				        .duration(500)
				        .style('opacity', 1)

				    toolTip.html(d.y)
				        .style('left', (d3.event.pageX) + 'px')
				        .style('top', (d3.event.pageY) + 'px')

				    tempColor = this.style.fill;
				    d3.select(this)
				        .style('opacity', 0.8)
				  })
				  .on('mouseleave', function(d) {
				  	  toolTip.style('opacity', 0);
				      d3.select(this)
				         .style('opacity', 1)
				         .style('fill', tempColor)
				  });

		      rects.transition()
		          .duration(2000)
		          .ease('elastic')
			      .delay(function(d, i) { 
			      	  return i * 30; 
			      })
			      .attr("x", function(d) {
			          return xScale(d.y0); 
			      })
			      .attr("width", function(d) { 
			      	  return xScale(d.y); 
			      });

			  var legendbox = svg.append("g")
			       .attr("class", "legendbox")
			       .attr('transform', 'translate(150, 0)');

			  var legend = legendbox.selectAll(".legend")
			      .data(headers.slice())
			      .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { 
			      	return "translate(" + i * 100 + ", -45)"; 
			      });

			  legend.append("rect")
			      .attr("x", 0)
			      .attr("width", 18)
			      .attr("height", 15)
			      .style("fill", colors);

			  legend.append("text")
			      .attr("x", 22)
			      .attr("y", 7)
			      .attr("dy", ".35em")
			      .style("text-anchor", "begin")
			      .style("font" ,"10px sans-serif")
			      .text(function(d) { 
			      	 return d; 
			      });
			    
			});
	    }
	};

}]);