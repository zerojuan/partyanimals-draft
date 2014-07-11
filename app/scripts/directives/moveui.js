'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:moveui
 * @description
 * # moveui
 */
angular.module('partyanimalsDraftApp')
  .directive('moveUi', function () {
    return {
      require: '^activitySim',
      templateUrl: 'partials/move-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        simCtrl.setDone({
          type: 'MOVE',
          district: scope.activity.location,
          name: scope.activity.name,
          cost: scope.activity.cost,
          success: true
        });
      }
    };
  });
