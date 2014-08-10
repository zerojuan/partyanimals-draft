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
            height = 400 - margin.top - margin.bottom;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(200)
            .size([width, height]);

        var svg = d3.select('.chart').append('svg')
          .attr('width', width)
          .attr('height', height);

        function transition(path) {
          path.transition()
              .duration(7500)
              .attrTween('stroke-dasharray', tweenDash)
              .each('end', function() { d3.select(this).call(transition); });
        }

        function tweenDash() {
          var l = this.getTotalLength(),
              i = d3.interpolateString('0,' + l, l + ',' + l);
          return function(t) { return i(t); };
        }

        scope.$watch('kapitans', function(){
          if(scope.kapitans && scope.kapitans.length > 0){
            //construct relationship graph based on kapitans
            var nodes = angular.copy(scope.kapitans);
            var links = [];
            _.forEach(nodes, function(val){
              var data = {};
              _.forEach(val.relations, function(rel, i){
                if(i > 5) {return;}
                data = {
                  source: val.id,
                  target: i,
                  value: rel
                };
                links.push(data);
              });
              links.push({
                source: val.id,
                target: nodes.length,
                value: val.humanRelations
              });
              links.push({
                source: val.id,
                target: nodes.length+1,
                value: val.aiRelations
              });
              val.weight = 1;
              val.width = 30;
              val.height = 30;
            });
            nodes.push({
              id: -1,
              name: 'Mousey',
              x: 100,
              y: 130,
              image: 'mouseyMale.jpg',
              weight: 1,
              width: 50,
              height: 50,
              fixed: true
            });
            nodes.push({
              id: -2,
              x: width - 100,
              y: 130,
              name: 'Crocopio',
              image: 'crocopio.jpg',
              weight: 1,
              width: 50,
              height: 50,
              fixed: true
            });
            force
              .nodes(nodes)
              .links(links)
              .start();
            var link = svg.selectAll('.link')
                .data(links);
            link.enter().append('path')
                .attr('class', 'link')
                // .style('stroke-dasharray', '4,4')
                .style('stroke-width', function(d) { return Math.sqrt(d.value); })
                .call(transition);

            var node = svg.selectAll('.node')
                .data(nodes)
              .enter().append('svg:image')
               .attr('x', function(d){return d.x-d.width/2;})
               .attr('y', function(d){return d.y-d.height/2;})
               .attr('width', function(d){ return d.width;})
               .attr('height', function(d){return d.height;})
               .attr('xlink:href', function(d){return 'assets/images/avatars/'+d.image;})
               .call(force.drag);



            force.on('tick', function() {
              // link.attr('x1', function(d) { return d.source.x; })
              //     .attr('y1', function(d) { return d.source.y; })
              //     .attr('x2', function(d) { return d.target.x; })
              //     .attr('y2', function(d) { return d.target.y; });
              link.attr('d', function(d) {
                  var dx = d.target.x - d.source.x,
                      dy = d.target.y - d.source.y,
                      dr = Math.sqrt(dx * dx + dy * dy);
                  return 'M' +
                      d.source.x + ',' +
                      d.source.y + 'A' +
                      dr + ',' + dr + ' 0 0,1 ' +
                      d.target.x + ',' +
                      d.target.y;
              });
              node.attr('x', function(d) { return d.x-d.width/2; })
                  .attr('y', function(d) { return d.y-d.height/2; });
            });
          }
        });
      }
    };
  });
