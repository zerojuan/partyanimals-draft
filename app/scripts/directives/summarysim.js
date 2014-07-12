'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:talkui
 * @description
 * # talkui
 */
angular.module('partyanimalsDraftApp')
  .directive('summarySim', function () {
    return {
      templateUrl: 'partials/summarysim.html',
      restrict: 'E',
      replace: true,
      scope: {
        summaries: '=',
        totalContribution: '=',
        totalCost: '='
      }
    };
  });
