'use strict';

angular.module('partyanimalsDraftApp')
  .directive('itineraryView', function () {
    return {
      templateUrl: 'components/itineraryView/itineraryView.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        scheduledActivities: '=',
        hours: '=',
        onGo: '='
      }
    };
  });
