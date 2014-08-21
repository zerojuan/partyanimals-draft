'use strict';

angular.module('partyanimalsDraftApp')
  .directive('teamTab', function () {
    return {
      templateUrl: 'components/teamTab/teamTab.html',
      restrict: 'E',
      scope: {
        human: '='
      },
      link: function (scope) {
        scope.showGraph = false;
      }
    };
  });
