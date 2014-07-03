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
      templatUrle: 'partials/talk-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
