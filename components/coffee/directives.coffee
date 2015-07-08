app.directive 'stackedBar', [
  'd3Service'
  (d3Service) ->
    {
      restrict: 'E'
      scope: data: '='
      link: (scope, elem, attrs) ->

        # Resolve the d3 raw object
        d3Service.d3().then (d3) ->

          # Initiate the variables for the charts
          margin = 
            top: 55
            right: 25
            bottom: 15
            left: 125
          width = 800 - (margin.left) - (margin.right)
          height = 550 - (margin.top) - (margin.bottom)
          headers = [
            'Low Activity'
            'Med Activity'
            'High Activity'
          ]
          tempColor = undefined

          # Set up the x-scale and y-scale the axis
          yScale = d3.scale.ordinal()
              .rangeRoundBands [0, height], .66, 0.2

          xScale = d3.scale.linear()
              .rangeRound [0, width]

          xScale2 = d3.scale.linear()
              .rangeRound [0, width]

          # Set up the color scales for the chart
          colors = d3.scale.ordinal()
              .domain headers
              .range ['#B0D6E0', '#0FB0DF', '#0E678A']
          
          # Define variables the x and y axis for the chart
          xAxis = d3.svg.axis()
             .scale xScale
             .tickSize -height
             .tickPadding 8
             .orient 'top'

          xAxis2 = d3.svg.axis()
             .scale xScale2
             .orient 'top'

          yAxis = d3.svg.axis()
             .scale yScale
             .outerTickSize 0
             .tickPadding 5
             .orient 'left'
          
          # Create the svg element for the chart
          svg = d3.select(elem[0]).append 'svg'
             .attr 'preserveAspectRatio', 'xMinYMin meet'
             .attr 'viewBox', '0 0 800 550'
             .attr 'id', 'stacked-bar'
             .append 'g'
             .attr 'transform', 'translate(' + margin.left + ', ' + margin.top + ')'

          # Create the tooltip element for hovering the stacked bar
          toolTip = d3.select('body').append 'div'
             .style 'position', 'absolute'
             .style 'padding', '10px 15px'
             .style 'border-radius', '5px'
             .style 'background', '#ccc'
             .style 'fill', '#000'
             .style 'opacity', 0

          # Create a new array for the data of each layer
          layers = d3.layout.stack()(['low', 'med', 'high'].map (level) ->
            scope.data.map (d) ->
              x: d.name
              y: +d[level]
          )

          # Set up the x-domain and y-domain for the x and y scale, respectively
          xScale.domain [0, d3.max(layers[layers.length - 1], (d) ->
            d.y0 + d.y
          )]

          xScale2.domain [0, d3.max(layers[layers.length - 1], (d) ->
            (d.y0 + d.y) / 10
          )]

          yScale.domain layers[0].map((d) ->
            d.x
          )

          # Create first x axis (horizontal axis) for the chart
          hAxis = svg.append 'g'
              .attr 'class', 'x-axis'
              .attr 'transform', 'translate(0, 0)'
              .call xAxis

          # Append the text label for the first x axis 
          hAxis.append 'text'
              .style 'font-size', '12px'
              .attr 'transform', 'translate(' + (width-43) + ', -28)'
              .text '# of Members'

          # Create second x axis (horizontal axis) for the chart 
          hAxis2 = svg.append 'g'
              .attr 'class', 'x-axis2'
              .attr 'transform', 'translate(0, ' + (height-40) + ')'
              .call xAxis2

          # Append the text label for the second x axis
          hAxis.append 'text'
              .style 'font-size', '12px'
              .attr 'transform', 'translate(' + (width+15) + ', ' + (height-50) + ')'
              .text '%'
          
          # Create the y axis (verital axis) for the chart
          vAxis = svg.append 'g'
              .attr 'class', 'y-axis'
              .call yAxis

          # Settings for the path of two x axises
          hAxis.selectAll('path').style
            'fill': 'none'
            'stroke': 'none'

          hAxis2.selectAll('path').style
            'fill': 'none'
            'stroke': 'none'
          
          # Settings for the line of two x axises 
          hAxis.selectAll('line')
              .style 'fill', 'none'
              .style 'stroke', '#000'
              .style 'stroke-opacity', 0.15
              .style 'shape-rendering', 'crispEdges'
          
          # Settings for the text of two x axises
          hAxis.selectAll('.tick text')
              .style 'font-size', '13px'
              .style 'fill', '#c2c2c2'

          hAxis2.selectAll('.tick text')
              .style 'font-size', '13px'
              .style 'fill', '#c2c2c2'
          
          # Settings for the path, line and text of y axis
          vAxis.selectAll('path')
              .style 'fill', 'none'
              .style 'stroke', '#000'
              .style 'shape-rendering', 'crispEdges'

          vAxis.selectAll('line')
              .style 'fill', 'none'
              .style 'stroke', '#000'
              .style 'shape-rendering', 'crispEdges'

          vAxis.selectAll('text')
              .style 'font-size', '12.5px'

          # Add a group element for each access group layer
          groups = svg.selectAll('.group')
              .data layers
              .enter().append 'g'
              .attr 'class', 'group'
              .style 'fill', (d, i) ->
                colors i
          
          # Create and add rectangle elements for each access group layer
          rects = groups.selectAll('rect')
              .data (d) ->
                d
              .enter().append 'rect'
              .attr 'x', 0
              .attr 'width', 0
              .attr 'y', (d) ->
                yScale d.x
              .attr 'height', yScale.rangeBand()

              # Add tooltip when hovering the retangle element
              .on 'mouseover', (d) ->
                toolTip.transition()
                    .duration 500
                    .style 'opacity', 1

                toolTip.html(d.y)
                    .style 'left', d3.event.pageX + 'px'
                    .style 'top', d3.event.pageY + 'px'

                tempColor = @style.fill
                d3.select(this).style 'opacity', 0.8
                return
              .on 'mouseleave', (d) ->
                toolTip.style 'opacity', 0
                d3.select(this)
                    .style 'opacity', 1
                    .style 'fill', tempColor
                return
          
          # Add transition for the stacked bar chart
          rects.transition()
              .duration 2000
              .ease 'elastic'
              .delay (d, i) ->
                i * 30
              .attr 'x', (d) ->
                xScale d.y0
              .attr 'width', (d) ->
                xScale d.y

          # Create legend for the chart
          legendbox = svg.append 'g'
              .attr 'class', 'legendbox'
              .attr 'transform', 'translate(150, 0)'

          legend = legendbox.selectAll('.legend')
              .data headers.slice()
              .enter().append 'g'
              .attr 'class', 'legend'
              .attr 'transform', (d, i) ->
                'translate (' + i * 100 + ', -45)'
          
          legend.append('rect')
              .attr 'x', 0
              .attr 'width', 18
              .attr 'height', 15
              .style 'fill', colors

          legend.append('text')
              .attr 'x', 22
              .attr 'y', 7
              .attr 'dy', '.35em'
              .style 'text-anchor', 'begin'
              .style 'font', '10px sans-serif'
              .text (d) ->
                d
        
    }
]
