'use strict';

angular.module('partyanimalsDraftApp')
  .directive('actorInTimeline', function () {
    return {
      templateUrl: 'components/actorInTimeline/actorInTimeline.html',
      restrict: 'E',
      scope: {
        staff: '='
      },
      link: function (scope, element, attrs) {
        
      }
    };
  });
