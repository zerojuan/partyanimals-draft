'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationBar', function () {
    return {
      templateUrl: 'components/reputationBar/reputationBar.html',
      restrict: 'E',
      scope: {
        aiReputations: '=',
        humanReputations: '='
      },
      link: function (scope) {
        scope.$watch('humanReputations', function(newVal){
          //scope.humanChange = newVal - oldVal;
          scope.human = newVal[newVal.length - 1];
          var previous = newVal[newVal.length - 2] ? newVal[newVal.length - 2] : 0;
          scope.humanChange = newVal[newVal.length - 1] - previous;
        }, true);

        scope.$watch('aiReputations', function(newVal){
          //scope.aiChange = newVal - oldVal;
          scope.ai = newVal[newVal.length - 1];
          var previous = newVal[newVal.length - 2] ? newVal[newVal.length - 2] : 0;
          scope.aiChange = newVal[newVal.length - 1] - previous;
        }, true);
      }
    };
  });
