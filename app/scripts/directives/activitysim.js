'use strict';

angular.module('partyanimalsDraftApp')
  .directive('activitySim', function () {
    return{
      templateUrl: 'partials/activity-sim.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '=',
        issues: '=',
        player: '=',
        onNextReady: '=',
        ai: '='
      },
      controller: function($scope){
        this.setDone = function(action){
          //call the main controller that we are done here
          $scope.onNextReady(action);
        };

        this.getIssues = function(){
          return $scope.issues;
        };

        this.getPlayer = function(){
          return $scope.player;
        };

        this.getAI = function(){
          return $scope.ai;
        };
      }
    };
  });
