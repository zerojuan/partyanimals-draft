'use strict';

angular.module('partyanimalsDraftApp')
  .directive('moveUi', function () {
    return {
      require: '^activitySim',
      templateUrl: 'components/moveUi/moveUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {

        scope.onDone = function(){
          simCtrl.setDone({
              type: 'MOVE',
              district: scope.activity.district,
              name: scope.activity.name,
              cost: scope.activity.cost,
              success: true
            });
        }
      }
    };
  });
