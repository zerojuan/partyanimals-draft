'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationBar', function () {
    return {
      templateUrl: 'components/reputationBar/reputationBar.html',
      restrict: 'E',
      scope: {
        ai: '=',
        human: '='
      },
      link: function (scope) {
        scope.$watch('human', function(newVal, oldVal){
          scope.humanChange = newVal - oldVal;
        });

        scope.$watch('ai', function(newVal, oldVal){
          scope.aiChange = newVal - oldVal;
        });
      }
    };
  });
