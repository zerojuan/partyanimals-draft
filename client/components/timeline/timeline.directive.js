'use strict';

angular.module('partyanimalsDraftApp')
  .directive('timeline', function () {
    return {
      templateUrl: 'components/timeline/timeline.html',
      restrict: 'E',
      scope: {
        timenow: '=',
        staffers: '=',
        human: '=',
        hours: '='
      },
      link: function (scope) {
        
      }
    };
  });
