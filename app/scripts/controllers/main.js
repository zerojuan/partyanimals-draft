'use strict';

angular.module('partyanimalsDraftApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.initialLimit = 5;
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.plus = function(thing){
      if($scope.initialLimit > 0){
          thing.level += 1;
          $scope.initialLimit -= 1;
      }

    }

    $scope.minus = function(thing){
      if(thing.level > 0){
          thing.level -= 1;
          $scope.initialLimit += 1;
      }
    }
  });
