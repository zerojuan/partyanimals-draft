'use strict';

angular.module('partyanimalsDraftApp')
  .directive('activitySim', function () {
    return{
      templateUrl: 'partials/activity-sim.html',
      restrict: 'E',
      scope: {
        activity: '=',
        onNextReady: '='
      },
      controller: function($scope){
        this.setDone = function(){
          //call the main controller that we are done here
          $scope.onNextReady();
        }
      }
    };
  });
