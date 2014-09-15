'use strict';

angular.module('partyanimalsDraftApp')
  .controller('MainCtrl', function ($scope, $http, $location, PAFirebase, GameState, platformPoints, districts, issues) {
      console.log('Platform Points: ', platformPoints);
      $scope.initialLimit = platformPoints;
      $scope.page = 1;
      $scope.selectedDistrict = null;

      $scope.issues = issues;
      $scope.districts = districts;

      $scope.presets = [{
        name: 'Liberal',
        values: [3,0,0,2,0]
      },{
        name: 'Autocrat',
        values: [0,3,2,0,0]
      },{
        name: 'Populist',
        values: [0,2,1,0,2]
      },{
        name: 'Customized',
        values: [0,0,0,0,0]
      }];

      function checkPreset(){
        //check if the same as other presets
        var some = _.some($scope.presets, function(preset){
          var match = _.every($scope.issues, function(issue, j){
            return issue.level === preset.values[j];
          });
          if(match){
            $scope.currentPreset = preset;
          }
          return match;
        });

        if(!some){
          $scope.currentPreset = $scope.presets[3];
        }

      }

      $scope.selectPreset = function(preset){
        $scope.currentPreset = preset;
        $scope.initialLimit = preset.name === 'Customized' ? 5 : 0;
        _.forEach($scope.issues, function(issue, i){
          issue.level = preset.values[i];
        });
      };

      $scope.selectPreset($scope.presets[0]);

      $scope.plus = function(thing){
        if($scope.initialLimit > 0){
          thing.level += 1;
          checkPreset();
          $scope.initialLimit -= 1;
        }
      };

      $scope.minus = function(thing){
        if(thing.level > 0){
          thing.level -= 1;
          checkPreset();
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
