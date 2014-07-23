'use strict';

angular.module('partyanimalsDraftApp')
  .directive('summarySim', function () {
    return {
      templateUrl: 'components/summarySim/summarySim.html',
      restrict: 'E',
      scope: {
        summaries: '=',
        aiSummaries: '=',
        totalContribution: '=',
        totalCost: '='
      }
    };
  });
