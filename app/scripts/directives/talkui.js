'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:talkui
 * @description
 * # talkui
 */
angular.module('partyanimalsDraftApp')
  .directive('talkUi', function () {
    return {
      require: '^activitySim',
      templateUrl: 'partials/talk-ui.html',
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
