'use strict';

angular.module('partyanimalsDraftApp')
  .controller('EndgameCtrl', function ($scope) {

    $scope.state = 'prep';
    $scope.votes = {};
    $scope.votes.human = 0;
    $scope.votes.ai = 0;
    $scope.sim = {};
    $scope.sim.activities = [];
    $scope.done = false;
    //MOCK DATA
    // function mockData(){
    //   $scope.totalReputations = [];
    //   for(var i = 0; i < 15; i++){
    //     $scope.totalReputations.push({
    //       turn: 15 - i,
    //       ai: {
    //         reputation: Math.random() * 30,
    //         votes: Math.random() * 30
    //       },
    //       human: {
    //         reputation: Math.random() * 30,
    //         votes: Math.random() * 30
    //       }
    //     });
    //   }
    //   _.forEach($scope.districts, function(val){
    //     val.aiProjectedVote = Math.floor(Math.random() * 500 + 1000);
    //     val.humanProjectedVote = Math.floor(Math.random() * 500 + 1000);
    //   });
    //   _.forEach($scope.kapitans, function(val){
    //     val.humanRelations = Math.random() * 50 + 50;
    //     val.aiRelations = Math.random() * 50 + 50;
    //   });
    //   $scope.human.totalCash = 1000;
    //   $scope.human.bribe = 3;
    //   $scope.ai.totalCash = 1000;
    // }

    //mockData();

    $scope.onSimulationDone = function(){
      $scope.state = 'summary';
      $scope.done = true;
    };

    $scope.onGoBack = function(){
      $scope.state = 'sim';
    };

    $scope.onPreparationDone = function(){
      $scope.state = 'sim';
    };
  });
