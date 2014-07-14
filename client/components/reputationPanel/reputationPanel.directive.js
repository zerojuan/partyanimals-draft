'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationPanel', function ($filter) {
    return {
      templateUrl: 'components/reputationPanel/reputationPanel.html',
      restrict: 'E',
      scope: {
        reputations: '='
      },
      link: function postlink(scope){
        scope.$watch('reputations', function(newVal, oldVal){
          if(newVal){
            if(!oldVal){
              oldVal = {
                human: {reputation: 0, votes:0},
                ai: {reputation:0, votes:0}
              };
            }

            scope.humanChange = newVal.human.reputation - oldVal.human.reputation;
            scope.aiChange = newVal.ai.reputation - oldVal.ai.reputation;
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
