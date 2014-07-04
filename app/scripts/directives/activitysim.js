'use strict';

angular.module('partyanimalsDraftApp')
  .directive('activitySim', function () {
    return{
      templateUrl: 'partials/activity-sim.html',
      restrict: 'E',
      scope: {
        activity: '=',
        issues: '=',
        player: '=',
        onNextReady: '='
      },
      controller: function($scope){
        this.setDone = function(){
          //call the main controller that we are done here
          $scope.onNextReady();
        }

        this.getIssues = function(){
          return $scope.issues;
        }

        this.getPlayer = function(){
          return $scope.player;
        }
      }
    };
  });
