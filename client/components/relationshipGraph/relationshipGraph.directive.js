'use strict';

angular.module('partyanimalsDraftApp')
  .directive('relationshipGraph', function ($filter) {
    return {
      templateUrl: 'components/relationshipGraph/relationshipGraph.html',
      restrict: 'E',
      scope: {
        kapitans: '='
      },
      link: function (scope) {
        var margin = {top: 20, right: 80, bottom: 30, left: 30},
            width = 740 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;
        var imageWidth = 20;

        var color = d3.scale.linear()
            .domain([0, 50, 100])
            .range(['red', '#ccc', 'green']);
        var x = d3.scale.linear().range([0, width]);
        x.domain([
          100,
          0
        ]);

        var xAxis = d3.svg.axis().scale(x).orient('top')
          .tickFormat(function(d) { return $filter('feelings')(d); })
          .tickValues([100, 90, 80, 50, 35, 15, 0]);
        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(0.5)
            .gravity(0.001)
            .size([width, height*100]);

        var svg = d3.select('#relationshipSvg')
          .attr('width', width+margin.left+margin.right)
          .attr('height', height+margin.top+margin.bottom)
          .append('g')
            .attr('transform', 'translate('+margin.left+','+margin.top+')');
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
        var node;
        scope.$watch('kapitans', function(){
          if(scope.kapitans && scope.kapitans.length > 0){

            var nodes = angular.copy(scope.kapitans);
            var extranodes = [];
            var links = [];
            _.forEach(nodes, function(node,i){
              extranodes.push({
                isChild: true,
                x: x(node.humanRelations),
                y: 20,
                value: node.humanRelations,
                fixed: true,
                parent: node.id
              });
            });
            nodes = nodes.concat(extranodes);
            console.log('nodes: ', nodes);
            _.forEach(nodes, function(node, i){
              console.log('target:',i+extranodes.length);
              if(node.isChild) return;
              links.push({
                source: node.id,
                target: i+extranodes.length,
                value: node.humanRelations
              });
            });
            force
              .nodes(nodes)
              .links(links)
              .start();
            svg.select('.x.axis')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + 20 + ')')
              .call(xAxis);
            var link = svg.selectAll('.link')
                .data(links);
            link.enter().append('line')
                .attr('class', 'link')
                .style('stroke', function(d){ return color(d.value);})
                .style('stroke-width', 1.5)
                .style('stroke-opacity', 0.5);
            node = svg.selectAll('.node')
                .data(nodes);
            node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', function(d){return 'translate('+d.x+','+d.y+')';})
                .call(force.drag);
            node.append('circle')
              .attr('cx', 0)
              .attr('cy', 0)
              .attr('r', function(d){
                if(d.isChild) return 2;
                return imageWidth/2;
              })
              .style('fill', function(d){
                if(d.isChild) return color(d.value);
                return color(d.humanRelations);
              })
              .style('stroke-width', 1.5)
              .style('stroke', function(d){
                if(d.isChild) return color(d.value);
                return color(d.humanRelations);
              });

            node.each(function(d){
              if(d.isChild) return;
              d3.select(this).append('image')
                .attr('x', imageWidth/2 * -1)
                .attr('y', imageWidth/2 * -1)
                .attr('width', imageWidth)
                .attr('height', imageWidth)
                .attr('clip-path', function(d){
                  return 'url(/game#g-mug-clip)';
                })
                .attr('xlink:href',function(d){return 'assets/images/avatars/'+d.image;});
            });

            force.on('tick', function() {
              link.attr('x1', function(d) { return d.source.x; })
                  .attr('y1', function(d) { return d.source.y; })
                  .attr('x2', function(d) { return x(d.target.value); })
                  .attr('y2', function(d) { return 20; });

              node.attr('transform', function(d){
                if(d.isChild){
                  d.x = x(d.value);
                  d.y = 20;
                }
                return 'translate('+d.x+','+d.y+')';
              });
            });
          }
        }, true);
      }
    };
  });
