'use strict';

angular.module('partyanimalsDraftApp')
  .directive('itineraryView', function () {
    return {
      templateUrl: 'partials/itinerary-view.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        scheduledActivities: '=',
        hours: '=',
        onGo: '='
      },
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });