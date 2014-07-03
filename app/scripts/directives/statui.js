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
      templateUrl: 'partials/stat-ui.html',
      restrict: 'E',
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
