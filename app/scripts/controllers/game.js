'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $http, GameState) {

    $scope.state = 'home';
    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;

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

    $http.get('/api/activities').success(function(activities){
      $scope.activities = activities;
    });

    $scope.changeSelected = function(district){
      if($scope.selectedDistrict){
        $scope.selectedDistrict.selected = false;
      }
      $scope.selectedDistrict = district;
      $scope.selectedDistrict.selected = true;
      $scope.selectedDistrict.kapitan = findKapitan($scope.selectedDistrict.kapitanId);
    }

    $scope.onKapSelected = function(kapitan){
      if($scope.selectedKapitan){
        $scope.selectedKapitan.active = false;
      }
      $scope.selectedKapitan = kapitan;
      $scope.selectedKapitan.active = true;
      //likes
      var likesData = [];
      $scope.selectedKapitan.likes.forEach(function(val){
        likesData.push(findKapitan(val));
      });
      var hatesData = [];
      $scope.selectedKapitan.hates.forEach(function(val){
        hatesData.push(findKapitan(val));
      });
      $scope.selectedKapitan.likesData = likesData;
      $scope.selectedKapitan.hatesData = hatesData;
    }

    $scope.onKapClicked = function(){
      $scope.state = 'kapitan';
      $scope.showItinerary = false;
    }

    $scope.onItClicked = function(){
      $scope.showItinerary = !$scope.showItinerary;
    }

    $scope.onBackHome = function(){
      $scope.state = 'home';
    }

    var findKapitan = function(id){
      var retVal = null;
      $scope.kapitans.forEach(function(val){
        if(val.id === id){
          retVal = val;
        }
      });
      return retVal;
    }
  });
