'use strict';

angular.module('partyanimalsDraftApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.initialLimit = 5;
    $scope.page = 1;
    $scope.selectedDistrict = null;

    $http.get('/api/issues').success(function(issues) {
      $scope.issues = issues;
    });

    $http.get('/api/districts').success(function(districts){
      $scope.districts = districts;
    });

    $scope.plus = function(thing){
      if($scope.initialLimit > 0){
        thing.level += 1;
        $scope.initialLimit -= 1;
      }
    };

    $scope.minus = function(thing){
      if(thing.level > 0){
        thing.level -= 1;
        $scope.initialLimit += 1;
      }
    };

    $scope.nextPage = function(){
      $scope.page = 2;
    };

    $scope.prevPage = function(){
      $scope.page = 1;
    };

    $scope.submit = function(){

    };

  });
