'use strict';

angular.module('partyanimalsDraftApp')
  .directive('votingGraph', function ($filter) {
    return {
      templateUrl: 'components/votingGraph/votingGraph.html',
      restrict: 'E',
      scope: {
        reputations: '='
      },
      link: function (scope) {
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
        var margin = {top: 20, right: 80, bottom: 30, left: 30},
            width = 740 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

         var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([width, height]);

        var svg = d3.select(".graph").append("svg")
            .attr("width", width)
            .attr("height", height);

        color.domain(['ai', 'human']);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return '<strong>Reputation:</strong> <span>' + $filter('number')(d.reputation,2) + '</span>';
          });

        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yAxis = d3.svg.axis().scale(y).orient('left');

        var line = d3.svg.line().interpolate('linear')
          .x(function(d){
            console.log('Line updating');
            return x(d.turn);
          })
          .y(function(d){
            return y(d.reputation);
          });

        var svg = d3.select('.chart').append('svg')
          .attr('width', width+margin.left+margin.right)
          .attr('height', height+margin.top+margin.bottom)
          .append('g')
            .attr('transform', 'translate('+margin.left+','+margin.top+')');

        svg.call(tip);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Reputation');

        var city = svg.selectAll('.candidate')
            .data(['candidate'])
          .enter().append('g')
            .attr('class', 'candidate');

        city.append('path')
          .attr('class', 'line ai')
          .attr('d', line([0]));

        city.append('path')
          .attr('class', 'line human')
          .attr('d', line([0]));

        scope.$watch('reputations', function(){
          if(scope.reputations && scope.reputations.length > 0){
            console.log('Reputation should be: ', scope.reputations);
            var ai = _.map(scope.reputations, function(val){
              return {turn: val.turn, vote: val.ai.vote, reputation: val.ai.reputation};
            });

            var human = _.map(scope.reputations, function(val){
              return {turn: val.turn, vote: val.human.vote, reputation: val.human.reputation};
            });


            x.domain([
              d3.max(scope.reputations, function(r){return r.turn;}),
              d3.min(scope.reputations, function(r){return r.turn;})
            ]);
            y.domain([
              0,
              d3.max(scope.reputations, function(r) { return Math.max(r.ai.reputation, r.human.reputation); })
            ]);

            xAxis.ticks(scope.reputations.length);

            svg.select('.y.axis')
              .attr('class', 'y axis')
              .call(yAxis);
            svg.select('.x.axis')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

            city.select('.line.ai')
              .attr('d', line(ai));

            city.select('.line.human')
              .attr('d', line(human));

            var aiCircles = city.selectAll('.ai-circle')
                .data(ai)
                .attr('class', 'ai-circle ai')
                .attr('cx', function(d){ return x(d.turn);})
                .attr('cy', function(d){ return y(d.reputation);})
                .attr('r', 3)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
            aiCircles.enter().append('circle')
                .attr('class', 'ai-circle ai')
                .attr('cx', function(d){ return x(d.turn);})
                .attr('cy', function(d){ return y(d.reputation);})
                .attr('r', 3)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var humanCircles = city.selectAll('.human-circle')
              .data(human)
              .attr('class', 'human-circle human')
              .attr('cx', function(d){ return x(d.turn);})
              .attr('cy', function(d){ return y(d.reputation);})
              .attr('r', 3)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
            humanCircles.enter().append('circle')
              .attr('class', 'human-circle human')
              .attr('cx', function(d){ return x(d.turn);})
              .attr('cy', function(d){ return y(d.reputation);})
              .attr('r', 3)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
          }
        }, true);

      }
    };
  });
