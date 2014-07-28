'use strict';

angular.module('partyanimalsDraftApp')
  .directive('specialUi', function ($filter, GameState) {
    return {
      require: '^activitySim',
      templateUrl: 'components/specialUi/specialUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;
        scope.onDone = function(){
          scope.done = true;
          result.cost = scope.activity.cost;
          simCtrl.setDone(result);
        };

        scope.$watch('activity', function(){
          if(scope.activity){
            scope.done = false;
            result = GameState.getReputationActivityResult(scope.activity);
            var parseVal = {
              gold: result.value
            };
            console.log('Result:', result);
            if(result.success){
              scope.doneMessage = $filter('messageparser')(scope.activity.text.success[0], parseVal);
            }else{
              scope.doneMessage = scope.activity.text.fail[0];
            }

          }
        });
      }
    };
  });
