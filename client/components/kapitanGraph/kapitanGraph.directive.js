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

        var color = d3.scale.linear()
            .domain([0, 50, 100])
            .range(['red', '#ccc', 'green']);
        var strokeWidth = d3.scale.linear()
            .domain([0, 50, 100])
            .range([10, 3, 10]);

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(200)
            .size([width, height]);

        var svg = d3.select('#mySvg')
          .attr('width', width)
          .attr('height', height);

        //legend
        var legend = d3.select('.legend-bar').selectAll('.legend-block')
          .data([0, 20, 30, 40, 50, 60, 70, 80, 90, 100]).enter().append('div')
          .attr('class', 'legend-block')
          .style('background', function(d){
            return color(d);
          });

        var selectKapitan = function(d){
          scope.selectedKapitan = d;
          scope.$apply();
        };

        function transition(path) {
          path.transition()
              .duration(500)
              .attrTween('stroke-dasharray', tweenDash);
              //.each('end', function() { d3.select(this).call(transition); });
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
              description: 'This is you.',
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
              description: 'The incumbent.',
              weight: 1,
              width: 50,
              height: 50,
              fixed: true
            });
            force
              .nodes(nodes)
              .links(links)
              .start();
              // patterns.append('polygon')
              //   .attr('points', '5,0 10,10 0,10');

            var link = svg.selectAll('.link')
                .data(links);
            link.enter().append('path')
                .attr('class', 'link')
                .style('stroke', function(d){ return color(d.value);})
                .style('stroke-width', function(d) {
                  return strokeWidth(d.value);
                })
                .style('stroke-opacity', 0.1);
                // .call(transition);

            var link2 = svg.selectAll('.link-2')
                  .data(links);
              link2.enter().append('path')
                  .attr('class', 'link-2')
                  .style('stroke', function(d){ return color(d.value);})
                  .style('stroke-width', function(d) { return strokeWidth(d.value);  })
                  .style('stroke-opacity', 0);

            var node = svg.selectAll('.node')
                .data(nodes)
              .enter().append('g')
                .attr('transform', function(d){return 'translate('+d.x+','+d.y+')';})
                .call(force.drag);
            node.append('circle')
              .attr('cx', 0)
              .attr('cy', 0)
              .attr('r', function(d){
                if(d.id < 0){
                  return 30;
                }
                return 20;
              })
              .style('fill', '#ccc')
              .style('stroke-width', 1.5)
              .style('stroke', '#ccc');
            node.append('svg:image')
              .attr('x', function(d){return -d.width/2;})
              .attr('y', function(d){return -d.height/2;})
              .attr('width', function(d){ return d.width;})
              .attr('height', function(d){return d.height;})
              .attr('clip-path', function(d){
                if(d.id < 0){
                  return 'url(/game#g-player-mug-clip)';
                }
                return 'url(/game#g-mug-clip)';
              })
              .attr('xlink:href',function(d){return 'assets/images/avatars/'+d.image;});
              // node.append('circle')
              //    .attr('cx', 0)
              //    .attr('cy', 0)
              //    .attr('r', 20)
              //    .style('stroke', 'black')
              //    .style('fill', 'transparent')
              //    .style('stroke-width', 5);
            var showHighlight = function(d, context){
              selectKapitan(d);
              d3.select(context).select('circle')
                .transition()
                .duration(500)
                .style('fill', '#eee');
              link2.each(function(l){
                if(d.id < 0){
                  if(l.target.id === d.id){
                    d3.select(this).style('stroke-opacity', '1').call(transition);
                  }
                }
                if(l.source.id === d.id){
                  d3.select(this).style('stroke-opacity', '1').call(transition);
                }
              });
            };

            var hideHighlight = function(d, context){
              selectKapitan(null);
              d3.select(context).select('circle')
                .transition()
                .duration(500)
                .style('fill', '#ccc');
              link2.each(function(l){
                if(d.id < 0){
                  if(l.target.id === d.id){
                    d3.select(this).style('stroke-opacity', '0');
                  }
                }
                if(l.source.id === d.id){
                  d3.select(this).style('stroke-opacity', '0');
                }
              });
            };
            node.on('mouseover', function(d){
              showHighlight(d, this);
            });

            node.on('mouseout', function(d){
              hideHighlight(d, this);
            });

            node.on('touchend', function(d){
              link2.each(function(){
                d3.select(this).style('stroke-opacity', '0');
              });
              showHighlight(d, this);
            });

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
              link2.attr('d', function(d) {
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
              node.attr('transform', function(d){return 'translate('+d.x+','+d.y+')';});
            });
          }
        });
      }
    };
  });
