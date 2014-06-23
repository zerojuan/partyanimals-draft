'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $http, GameState) {

    $scope.state = 'home';
    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();

    $http.get('/api/districts').success(function(districts){
      $scope.districts = districts;
      $scope.districts.forEach(function(val){
        if(val.id === $scope.human.hq.id){
          val.isHQ = true;
          val.hasHuman = true;
        }
        if(val.id === $scope.ai.hq.id){
          val.isAIHQ = true;
          val.hasAI = true;
          $scope.ai.hq = val;
        }
      });
    });

    $http.get('/api/issues').success(function(issues) {
      $scope.issues = issues;
    });

    $http.get('/api/kapitans').success(function(kapitans){
      $scope.kapitans = kapitans;
    });

    $scope.changeSelected = function(district){
      if($scope.selectedDistrict){
        $scope.selectedDistrict.selected = false;
      }
      $scope.selectedDistrict = district;
      $scope.selectedDistrict.selected = true;
    }

    $scope.onKapClicked = function(){
      $scope.state = 'kapitan';
    }

    $scope.onItClicked = function(){
      $scope.state = 'itinerary';
    }

    $scope.onBackHome = function(){
      $scope.state = 'home';
    }


  });
