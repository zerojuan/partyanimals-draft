'use strict';

angular.module('partyanimalsDraftApp')
  .directive('updatesTab', function () {
    return {
      templateUrl: 'components/updatesTab/updatesTab.html',
      restrict: 'E',
      scope: {
        updates: '='
      },
      link: function (scope) {

      }
    };
  });
