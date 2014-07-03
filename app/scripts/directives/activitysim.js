'use strict';

angular.module('partyanimalsDraftApp')
  .directive('activitySim', function () {
    return{
      templateUrl: 'partials/activity-sim.html',
      restrict: 'E',
      scope: {
        activity: '='
      },
      link: function postLink(scope) {
        //get what type of activity this is
      }
    };
  });
