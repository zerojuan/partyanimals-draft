'use strict';

angular.module('partyanimalsDraftApp')
  .directive('welcomePaper', function () {
    return {
      templateUrl: 'components/welcomePaper/welcomePaper.html',
      restrict: 'E',
      scope: {
        totalReputations: '=',
        issue: '@',
        ai: '=',
        human: '='
      },
      transclude: true,
      link: function (scope, element, attrs) {

      }
    };
  });
