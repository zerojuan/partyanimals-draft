'use strict';

angular.module('partyanimalsDraftApp')
  .directive('kapitanGraph', function () {
    return {
      templateUrl: 'components/kapitanGraph/kapitanGraph.html',
      restrict: 'E',
      scope: {
        kapitans: '=',
        selectedKapitan: '='
      },
      link: function (scope) {
        //do some d3 magic here
        var margin = {top: 20, right: 80, bottom: 30, left: 30},
            width = 740 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(100)
            .size([width, height]);

        var svg = d3.select('.chart').append('svg')
          .attr('width', width)
          .attr('height', height);

        scope.$watch('kapitans', function(){
          if(scope.kapitans && scope.kapitans.length > 0){
            //construct relationship graph based on kapitans
            var links = [];
            _.forEach(scope.kapitans, function(val){
              _.forEach(val.relations, function(rel, i){
                if(i > 5) {return;}
                var data = {
                  source: val.id,
                  target: i,
                  value: rel
                };
                links.push(data);
              });
              val.weight = 1;
            });
            console.log('Kapitans: ', scope.kapitans);
            force
              .nodes(scope.kapitans)
              .links(links)
              .start();
            var link = svg.selectAll('.link')
                .data(links)
              .enter().append('line')
                .attr('class', 'link')
                .style('stroke-width', function(d) { return Math.sqrt(d.value); });

            var node = svg.selectAll('.node')
                .data(scope.kapitans)
              .enter().append('svg:image')
               .attr('x', function(d){return d.x;})
               .attr('y', function(d){return d.y;})
               .attr('width', 30)
               .attr('height', 30)
               .attr('xlink:href', function(d){return 'assets/images/avatars/'+d.image;})
               .call(force.drag);

            force.on('tick', function() {
              link.attr('x1', function(d) { return d.source.x; })
                  .attr('y1', function(d) { return d.source.y; })
                  .attr('x2', function(d) { return d.target.x; })
                  .attr('y2', function(d) { return d.target.y; });

              node.attr('x', function(d) { return d.x; })
                  .attr('y', function(d) { return d.y; });
            });
          }
        });
      }
    };
  });
