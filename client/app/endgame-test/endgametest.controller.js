'use strict';

angular.module('partyanimalsDraftApp')
  .controller('EndgameTest', function ($scope, $interval) {
    var District = function(name, population, playerRep, aiRep){
      return {
        name: name,
        reputation: {
          player: playerRep,
          ai: aiRep
        },
        index: 10,
        population: population,
        action: 'support',
        budget: 0,
        aiAction: 'support',
        aiBudget: 100
      };
    };

    $scope.player = {
      budget: 2000
    };

    $scope.ai = {
      budget: 2000
    };

    $scope.results = [];

    $scope.simulationMode = false;

    $scope.districts = [
      new District('kapitolyo', 3000, 20, 23),
      new District('casino', 2500, 60, 30),
      new District('fishingvillage', 1000, 60, 30),
      new District('port', 700, 50, 20),
      new District('cathedral', 1200, 20, 40),
      new District('resort', 1400, 20, 80)
    ];

    $scope.orderedDistricts = [];

    $scope.$watch('orderedDistricts', function(){
      _.forEach($scope.districts, function(district){
        district.index=  10;
      });
      _.forEach($scope.orderedDistricts, function(districtName, i){
          var district = _.find($scope.districts, function(district){
            return district.name === districtName;
          });
          district.index = i;
      });
      $scope.districts = _.sortBy($scope.districts, function(district){
        return district.index;
      });
      console.log($scope.districts);
    }, true);

    $scope.toggleAction = function(district){
        if(district.action === 'support'){
            district.action = 'suppress';
        }else{
          district.action = 'support';
        }
    };

    $scope.clickSubmit = function(){
      $scope.simulationMode = true;
      //calculate ai movement
      //select most populous
      _.forEach($scope.districts, function(district){
        var myProposed = 0;
        if(district.index !== 10){
          //if this is something with an action
          myProposed = district.budget+100;
          if($scope.ai.budget-myProposed > 0){
            district.aiAction = 'suppress';
            district.aiBudget = myProposed;
          }
        }else{
          myProposed = 100;
          if($scope.ai.budget-myProposed > 0){
            district.aiAction = 'support';
            district.aiBudget = myProposed;

          }
        }
        $scope.ai.budget -= myProposed;
      });
      //select most
      //start the timer, slowly keep adding to the result
      var resultDone = 0;
      var updateTime = function(){
        var district = $scope.districts[resultDone];
        resultDone++;
        var difference = 0;
        if(district.index !== 10){
          if(district.budget > district.aiBudget){
            //player wins
            district.winner = 'player';
            difference = district.budget - district.aiBudget;
            if(district.action === 'support'){
              //support
              
            }else{
              //suppress
            }
          }else{
            //ai wins
            district.winner = 'ai';
          }
        }
        $scope.results.push(district);
        if(resultDone === $scope.districts.length){
          $scope.winner = {
            msg: 'Someone won'
          };
          $interval.cancel(stopTime);
        }
      };
      var stopTime = $interval(updateTime, 1000);
    };

    $scope.getTotalSpending = function(){
      return _.reduce($scope.districts, function(memo, val){
        if(val.index !== 10){
          return memo + val.budget;
        }
        return memo;
      }, 0);
    };
  });
