'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:sortieui
 * @description
 * # sortieui
 */
angular.module('partyanimalsDraftApp')
  .directive('sortieUi', function () {
    return {
      templateUrl: 'partials/sortie-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
