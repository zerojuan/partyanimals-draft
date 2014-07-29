'use strict';

angular.module('partyanimalsDraftApp')
  .directive('votingGraph', function () {
    return {
      templateUrl: 'components/votingGraph/votingGraph.html',
      restrict: 'E',
      scope: {
        reputations: '='
      },
      link: function (scope, element, attrs) {
        var chart = d3.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
        chart.append('div').attr('class', 'chart')
             .selectAll('div')
             .data(scope.reputations).enter().append('div')
             .transition().ease('elastic')
             .style('height', function(d) { return d.ai.reputation + '%'; })
             .text(function(d) { return d.ai.reputation + '%'; });
      }
    };
  });
