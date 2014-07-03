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
        simCtrl.setDone();
      }
    };
  });
