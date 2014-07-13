'use strict';

angular.module('partyanimalsDraftApp')
  .controller('MainCtrl', function ($scope, $http, $location, PAFirebase, GameState) {
      PAFirebase.platformPointsRef.on('value', function(snapshot){
        $scope.initialLimit = snapshot.val();
        $scope.$apply();
      });
      $scope.initialLimit = 0;
      $scope.page = 1;
      $scope.selectedDistrict = null;

      PAFirebase.issuesRef.on('value', function(snapshot){
        $scope.issues = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.districtsRef.on('value',function(snapshot){
        $scope.districts = snapshot.val();
        $scope.districts.forEach(function(val){
          val.humanReputation = 0;
          val.aiReputation = false;
        });
        $scope.$apply();
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
        //set ai issues
        var aiIssues = [];
        //randomize aiIssues:
        $scope.issues.forEach(function(val, i){
          var newVal = angular.copy(val);
          if(i === 0){
            newVal.level = 3;
          }else if(i === 1){
            newVal.level = 1;
          }else if(i === 2){
            newVal.level = 1;
          }else if(i === 3){
            newVal.level = 0;
          }else if(i === 4){
            newVal.level = 0;
          }
          aiIssues.push(newVal);
        });
        //set ai selected district
        var aiHQ = null;
        var index = Math.floor(Math.random()*$scope.districts.length-1);
        index = (index === $scope.selectedDistrict.id) ? index+1 : index;
        aiHQ = $scope.districts[index];
        GameState.setHuman($scope.issues, $scope.selectedDistrict);
        GameState.setAI(aiIssues, aiHQ);
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
