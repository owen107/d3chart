app.directive('stackedBar', [
  'd3Service', function(d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, elem, attrs) {
        return d3Service.d3().then(function(d3) {
          var colors, groups, hAxis, hAxis2, headers, height, layers, legend, legendbox, margin, rects, svg, tempColor, toolTip, vAxis, width, xAxis, xAxis2, xScale, xScale2, yAxis, yScale;
          margin = {
            top: 55,
            right: 45,
            bottom: 15,
            left: 100
          };
          width = 800 - margin.left - margin.right;
          height = 550 - margin.top - margin.bottom;
          headers = ['Low Activity', 'Med Activity', 'High Activity'];
          tempColor = void 0;
          yScale = d3.scale.ordinal().rangeRoundBands([0, height], .66, 0.2);
          xScale = d3.scale.linear().rangeRound([0, width]);
          xScale2 = d3.scale.linear().rangeRound([0, width]);
          colors = d3.scale.ordinal().domain(headers).range(['#B0D6E0', '#0FB0DF', '#0E678A']);
          xAxis = d3.svg.axis().scale(xScale).tickSize(-height).tickPadding(8).orient('top');
          xAxis2 = d3.svg.axis().scale(xScale2).orient('top');
          yAxis = d3.svg.axis().scale(yScale).outerTickSize(0).tickPadding(5).orient('left');
          svg = d3.select(elem[0]).append('svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 800 550').attr('id', 'stacked-bar').append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
          toolTip = d3.select('body').append('div').style('position', 'absolute').style('padding', '10px 15px').style('border-radius', '5px').style('background', '#ccc').style('opacity', 0);
          layers = d3.layout.stack()(['low', 'med', 'high'].map(function(level) {
            return scope.data.map(function(d) {
              return {
                x: d.name,
                y: +d[level]
              };
            });
          }));
          xScale.domain([
            0, d3.max(layers[layers.length - 1], function(d) {
              return d.y0 + d.y;
            })
          ]);
          xScale2.domain([
            0, d3.max(layers[layers.length - 1], function(d) {
              return (d.y0 + d.y) / 10;
            })
          ]);
          yScale.domain(layers[0].map(function(d) {
            return d.x;
          }));
          hAxis = svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, 0)').call(xAxis);
          hAxis.append('text').style('font-size', '10px').attr('transform', 'translate(' + (width - 43) + ', -28)').text('# of Members');
          hAxis2 = svg.append('g').attr('class', 'x-axis2').attr('transform', 'translate(0, ' + (height - 40) + ')').call(xAxis2);
          hAxis.append('text').style('font-size', '10px').attr('transform', 'translate(' + (width + 15) + ', ' + (height - 50) + ')').text('%');
          vAxis = svg.append('g').attr('class', 'y-axis').call(yAxis);
          hAxis.selectAll('path').style({
            'fill': 'none',
            'stroke': 'none'
          });
          hAxis2.selectAll('path').style({
            'fill': 'none',
            'stroke': 'none'
          });
          hAxis.selectAll('line').style('fill', 'none').style('stroke', '#000').style('stroke-opacity', 0.15).style('shape-rendering', 'crispEdges');
          hAxis.selectAll('.tick text').style('font-size', '10px').style('fill', '#c2c2c2');
          hAxis2.selectAll('.tick text').style('font-size', '10px').style('fill', '#c2c2c2');
          vAxis.selectAll('path').style('fill', 'none').style('stroke', '#000').style('shape-rendering', 'crispEdges');
          vAxis.selectAll('line').style('fill', 'none').style('stroke', '#000').style('shape-rendering', 'crispEdges');
          vAxis.selectAll('text').style('font-size', '10px');
          groups = svg.selectAll('.group').data(layers).enter().append('g').attr('class', 'group').style('fill', function(d, i) {
            return colors(i);
          });
          rects = groups.selectAll('rect').data(function(d) {
            return d;
          }).enter().append('rect').attr('x', 0).attr('width', 0).attr('y', function(d) {
            return yScale(d.x);
          }).attr('height', yScale.rangeBand()).on('mouseover', function(d) {
            toolTip.transition().duration(200).style('opacity', 1);
            toolTip.html(d.y).style('left', d3.event.pageX + 'px').style('top', d3.event.pageY + 'px');
            tempColor = this.style.fill;
            d3.select(this).style('opacity', 0.8);
          }).on('mouseout', function(d) {
            toolTip.transition().duration(200).style('opacity', 0);
            d3.select(this).style('opacity', 1).style('fill', tempColor);
          });
          rects.transition().duration(2000).ease('elastic').delay(function(d, i) {
            return i * 30;
          }).attr('x', function(d) {
            return xScale(d.y0);
          }).attr('width', function(d) {
            return xScale(d.y);
          });
          legendbox = svg.append('g').attr('class', 'legendbox').attr('transform', 'translate(150, 0)');
          legend = legendbox.selectAll('.legend').data(headers.slice()).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
            return 'translate (' + i * 100 + ', -45)';
          });
          legend.append('rect').attr('x', 0).attr('width', 18).attr('height', 15).style('fill', colors);
          return legend.append('text').attr('x', 22).attr('y', 7).attr('dy', '.35em').style('fill', '#9E9D9D').style('text-anchor', 'begin').style('font', '10px sans-serif').text(function(d) {
            return d;
          });
        });
      }
    };
  }
]);
