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
        population: population
      };
    };

    $scope.districts = [
      new District('kapitolyo', 1000, 20, 23),
      new District('casino', 1000, 60, 30),
      new District('fishingvillage', 1000, 60, 30),
      new District('port', 500, 50, 20),
      new District('cathedral', 600, 20, 40),
      new District('resort', 250, 20, 80)
    ];



  });
