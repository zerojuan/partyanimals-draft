'use strict';

angular.module('partyanimalsDraftApp')
  .directive('talkUi', function () {
    return {
      require: '^activitySim',
      templateUrl: 'components/talkUi/talkUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;
        scope.onDone = function(){
          scope.done = true;
          simCtrl.setDone(result);
        };

        scope.$watch('activity', function(){
          scope.done = false;
          result = {
            type: 'TALK',
            cost: scope.activity.cost
          };
        });
      }
    };
  });
