'use strict';

angular.module('partyanimalsDraftApp')
  .controller('EndgameTest', function ($scope) {
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
        budget: 0
      };
    };

    $scope.player = {
      budget: 2000
    };

    $scope.ai = {
      budget: 2000
    };

    $scope.districts = [
      new District('kapitolyo', 1000, 20, 23),
      new District('casino', 1000, 60, 30),
      new District('fishingvillage', 1000, 60, 30),
      new District('port', 500, 50, 20),
      new District('cathedral', 600, 20, 40),
      new District('resort', 250, 20, 80)
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
      //show the next stage of the game
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
