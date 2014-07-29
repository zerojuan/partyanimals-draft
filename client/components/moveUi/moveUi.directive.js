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

        scope.$watch('activity', function(){
          if(scope.activity){
            simCtrl.setDone({
              type: 'MOVE',
              district: scope.activity.location,
              name: scope.activity.name,
              cost: scope.activity.cost,
              success: true
            });
          }
        });
      }
    };
  });
