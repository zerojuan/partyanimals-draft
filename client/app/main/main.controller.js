'use strict';

angular.module('partyanimalsDraftApp')
  .controller('MainCtrl', function ($scope, $http, $location, PAFirebase, GameState, platformPoints, districts, issues) {
      console.log('Platform Points: ', platformPoints);
      $scope.initialLimit = platformPoints;
      $scope.page = 1;
      $scope.selectedDistrict = null;

      $scope.issues = issues;
      $scope.districts = districts;

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
        //set ai issues
        var aiIssues = angular.copy($scope.issues);
        _.forEach(aiIssues, function(val){
          val.level = 0;
        });
        var index = GameState.getRandomNumberExcept($scope.selectedDistrict.id, $scope.districts.length);
        var aiHQ = $scope.districts[index];
        var personality = {};
        switch(index){
          case 4:
          case 0:
                personality.favoredKapitans = [0,4];
                personality.type = 'ELITIST';
                break;
          case 2:
          case 3:
                personality.favoredKapitans = [2,3];
                personality.type = 'POPULIST';
                break;
          case 1:
          case 5:
                personality.favoredKapitans = [1,5];
                personality.type = 'MONEY';
                break;
        }

        switch(index){
          case 4:
                //focus on religion
                aiIssues[4].level = 5;
                break;
          case 0:
                //focus on education and law and order
                aiIssues[0].level = 3;
                aiIssues[1].level = 2;
                break;
          case 2:
          case 3:
                aiIssues[2].level = 2;
                aiIssues[3].level = 3;
                break;
          case 1:
                aiIssues[0].level = 2;
                aiIssues[1].level = 2;
                aiIssues[2].level = 2;
                aiIssues[3].level = 2;
                aiIssues[4].level = 2;
                break;
          case 5:
                aiIssues[3].level = 4;
                aiIssues[4].level = 1;
                break;
        }

        GameState.setHuman($scope.issues, $scope.selectedDistrict);
        GameState.setAI(aiIssues, aiHQ, personality);
        $location.path('/game');
      };

      $scope.changeSelected = function(district){
        if($scope.selectedDistrict){
          $scope.selectedDistrict.selected = false;
        }
        $scope.selectedDistrict = district;
        $scope.selectedDistrict.selected = true;
      };
  });
