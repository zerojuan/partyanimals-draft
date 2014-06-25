'use strict';

angular.module('partyanimalsDraftApp')
  .directive('itineraryView', function () {
    return {
      templateUrl: 'partials/itinerary-view.html',
      restrict: 'E',
      replace: true,
      scope: {
        scheduledActivities: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];        
      }
    };
  });
