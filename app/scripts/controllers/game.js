'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $http, GameState) {
    var human = GameState.getHuman();
    var ai = GameState.getAI();

    $scope.human = human;
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();

    $http.get('/api/districts').success(function(districts){
      $scope.districts = districts;
      $scope.districts.forEach(function(val){
        if(val.id === human.hq.id){
          val.isHQ = true;
          val.hasHuman = true;
        }
        if(val.id === ai.hq.id){
          val.isAIHQ = true;
          val.hasAI = true;
          ai.hq = val;
        }
      });
    });

    $http.get('/api/issues').success(function(issues) {
      $scope.issues = issues;
    });

    $scope.changeSelected = function(district){
      if($scope.selectedDistrict){
        $scope.selectedDistrict.selected = false;
      }
      $scope.selectedDistrict = district;
      $scope.selectedDistrict.selected = true;
    }


  });
