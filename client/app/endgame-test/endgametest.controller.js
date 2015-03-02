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
        votes: {
          player: 0,
          ai: 0
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
        var textResult = '';
        var aiVoters = district.population * (district.reputation.ai / 100);
        var playerVoters = district.population * (district.reputation.player / 100);
        var neutralVoters = district.population - (aiVoters + playerVoters);
        var potentialVoters = 0;
        //checks if a district has special action
        if(district.budget > 0 || district.aiBudget > 0){
          if(district.budget > district.aiBudget){
            //player wins
            district.actionWinner = 'player';
            difference = district.budget - district.aiBudget;

            if(district.action === 'support'){
              //support
              potentialVoters = Math.min(Math.floor((difference / 100) * 20), neutralVoters);
              playerVoters += potentialVoters;
              textResult = 'Player convinced '+potentialVoters+' undecideds.';
            }else{
              //suppress
              potentialVoters = Math.min(Math.floor((difference / 100) * 20), aiVoters);
              aiVoters -= potentialVoters;
              textResult = 'Player convinced ' + potentialVoters + ' AI supporters to not vote';
            }
          }else{
            //ai wins
            district.actionWinner = 'ai';
            difference = district.aiBudget - district.budget;
            if(district.action === 'support'){
              potentialVoters = Math.min(Math.floor((difference / 100) * 20), neutralVoters);
              aiVoters += potentialVoters;
              textResult = 'AI convinced '+potentialVoters+' undecideds.';
            }else{
              potentialVoters = Math.min(Math.floor((difference / 100) * 20), playerVoters);
              playerVoters -= potentialVoters;
              textResult = 'AI convinced ' + potentialVoters + ' Player supporters to not vote';
            }
          }
        }else{
          textResult = 'No special action in this district';
        }
        district.votes.player = playerVoters;
        district.votes.ai = aiVoters;
        district.winner = (playerVoters >= aiVoters) ? 'player' :'ai';
        district.text = textResult;
        $scope.results.push(district);
        if(resultDone === $scope.districts.length){
          //calculate the votes
          var totalPlayerVotes = 0;
          var totalAIVotes = 0;
          var msg = '';
          _.forEach($scope.districts, function(district){
            totalPlayerVotes += district.votes.player;
            totalAIVotes += district.votes.ai;
          });
          if(totalPlayerVotes >= totalAIVotes){
            msg = 'Player Won By ' + (totalPlayerVotes - totalAIVotes);
          }else{
            msg = 'AI Won By ' + (totalAIVotes - totalPlayerVotes);
          }
          $scope.winner = {
            msg: msg
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
