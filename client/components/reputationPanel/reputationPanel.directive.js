'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationPanel', function ($filter, GameState) {
    return {
      templateUrl: 'components/reputationPanel/reputationPanel.html',
      restrict: 'E',
      scope: {
        reputations: '='
      },
      link: function postlink(scope){
        scope.$watch('reputations', function(newVal, oldVal){
          if(newVal && newVal[newVal.length-1]){
            var prev = newVal[newVal.length-2];
            var now = newVal[newVal.length-1];
            if(!prev){
              prev = {
                human: {reputation: 0, votes:0},
                ai: {reputation:0, votes:0},
                turn: -1
              };
            }

            scope.now = now;

            scope.humanChange = now.human.reputation - prev.human.reputation;
            scope.aiChange = now.ai.reputation - prev.ai.reputation;

          }
        });

        scope.getChangeString = function(val){
          if(val > 0){
            return '+'+$filter('number')(val,2);
          }else if(val === 0){
            return '=';
          }
          return $filter('number')(val,2);
        };
      }
    };
  });
