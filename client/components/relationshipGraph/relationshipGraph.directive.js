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
        var humanRange = d3.scale.linear().range([0, width]);
        humanRange.domain([
          100,
          0
        ]);
        var aiRange = d3.scale.linear().range([0,width]);
        aiRange.domain([
          0,
          100
        ]);

        function convertToFeelings(d){
          return $filter('feelings')(d);
        }
        var tickValues = [100, 90, 80, 50, 35, 15, 0];
        var humanAxis = d3.svg.axis().scale(humanRange).orient('bottom')
          .tickFormat(convertToFeelings)
          .tickValues(tickValues);
        var aiAxis = d3.svg.axis().scale(aiRange).orient('top')
          .tickFormat(convertToFeelings)
          .tickValues(tickValues.reverse());

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(0.5)
            .gravity(0.001)
            .size([width, height]);

        var svg = d3.select('#relationshipSvg')
          .attr('width', width+margin.left+margin.right)
          .attr('height', height+margin.top+margin.bottom)
          .append('g')
            .attr('transform', 'translate('+margin.left+','+margin.top+')');
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(humanAxis)
          .append('text')
            .attr('y', -10)
            .attr('x', width/2)
            .attr('dy', '.71en')
            .style('text-anchor', 'middle')
            .text('Mousey');
        svg.append('g')
          .attr('class', 'ai axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(aiAxis)
          .append('text')
            .attr('y', 10)
            .attr('x', width/2)
            .attr('dy', '.71em')
            .style('text-anchor', 'middle')
            .text('Catorcio');
        var node;
        scope.$watch('kapitans', function(){
          if(scope.kapitans && scope.kapitans.length > 0){

            var nodes = angular.copy(scope.kapitans);
            var humanNodes = [];
            var aiNodes = [];
            var links = [];
            _.forEach(nodes, function(node,i){
              humanNodes.push({
                isHumanChild: true,
                x: humanRange(node.humanRelations),
                y: 20,
                value: node.humanRelations,
                fixed: true,
                parent: node.id
              });
              aiNodes.push({
                isAIChild: true,
                x: aiRange(node.aiRelations),
                y: height - 20,
                value: node.aiRelations,
                fixed: true,
                parent: node.id
              });
            });
            nodes = nodes.concat(humanNodes).concat(aiNodes);
            var extranodesLength = aiNodes.length + humanNodes.length;
            _.forEach(nodes, function(node, i){
              if(node.isHumanChild) {return;}
              if(node.isAIChild) {return;}
              links.push({
                source: node.id,
                target: i+humanNodes.length,
                value: node.humanRelations
              });
              links.push({
                source: node.id,
                target: i+extranodesLength,
                value: node.aiRelations
              });
            });
            force
              .nodes(nodes)
              .links(links)
              .start();
            svg.select('.x.axis')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + 20 + ')')
              .call(humanAxis);
            svg.select('.ai.axis')
              .attr('class', 'ai axis')
              .attr('transform', 'translate(0,' + (height - 20) + ')')
              .call(aiAxis);
            var link = svg.selectAll('.link')
                .data(links);
            link.enter().append('line')
                .attr('class', 'link')
                .style('stroke', function(d){
                  return color(d.target.value);
                })
                .style('stroke-width', 1.5)
                .style('stroke-opacity', 0.5);
            link.style('stroke', function(d){
              return color(d.target.value);
            });
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
                if(d.isHumanChild || d.isAIChild) {return 2;}
                return imageWidth/2;
              })
              .style('fill', function(d){
                if(d.isHumanChild || d.isAIChild) {return color(d.value);}
                return color(d.humanRelations);
              })
              .style('stroke-width', 1.5)
              .style('stroke', function(d){
                if(d.isHumanChild || d.isAIChild) {return color(d.value);}
                return color(d.humanRelations);
              });

            node.each(function(d){
              if(d.isHumanChild || d.isAIChild) {return;}
              d3.select(this).append('image')
                .attr('x', imageWidth/2 * -1)
                .attr('y', imageWidth/2 * -1)
                .attr('width', imageWidth)
                .attr('height', imageWidth)
                .attr('clip-path', 'url(/game#g-mug-clip)')
                .attr('xlink:href',function(d){return 'assets/images/avatars/'+d.image;});
            });

            force.on('tick', function() {
              link.attr('x1', function(d) { return d.source.x; })
                  .attr('y1', function(d) { return d.source.y; })
                  .attr('x2', function(d) {
                    if(d.target.isAIChild){
                      return aiRange(d.target.value);
                    }
                    return humanRange(d.target.value);
                  })
                  .attr('y2', function(d){
                    if(d.target.isAIChild){
                      return height - 20;
                    }
                    return 20;
                  });

              node.attr('transform', function(d){
                if(d.isHumanChild){
                  d.x = humanRange(d.value);
                  d.y = 20;
                }
                if(d.isAIChild){
                  d.x = aiRange(d.value);
                  d.y = height - 20;
                }
                return 'translate('+d.x+','+d.y+')';
              });
            });
          }
        }, true);
      }
    };
  });
