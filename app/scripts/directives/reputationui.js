'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:reputationui
 * @description
 * # reputationui
 */
angular.module('partyanimalsDraftApp')
  .directive('reputationUi', function () {
    return {
      templateUrl: 'partials/reputation-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
