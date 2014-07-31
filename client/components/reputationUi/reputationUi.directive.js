'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationUi', function ($filter, GameState) {
    return {
      require: '^activitySim',
      templateUrl: 'components/reputationUi/reputationUi.html',
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
            scope.success = result.success;
            scope.districtName = scope.activity.location.name.split(' ').join('').toLowerCase();
            if(result.success){
              scope.doneMessage = scope.activity.text.success[0];
            }else{
              scope.doneMessage = scope.activity.text.fail[0];
            }
            scope.onDone();
          }
        });
      }
    };
  });
