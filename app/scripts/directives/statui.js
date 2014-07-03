'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:statui
 * @description
 * # statui
 */
angular.module('partyanimalsDraftApp')
  .directive('statUi', function () {
    return {
      require: '^activitySim',
      templateUrl: 'partials/stat-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        scope.onDone = function(){
          simCtrl.setDone();
        }
      }
    };
  });
