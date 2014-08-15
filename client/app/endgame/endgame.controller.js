'use strict';

angular.module('partyanimalsDraftApp')
  .controller('EndgameCtrl', function ($scope) {

    $scope.state = 'prep';
    $scope.humanVote = 0;
    $scope.aiVote = 0;
    //MOCK DATA
    function mockData(){
      $scope.totalReputations = [];
      for(var i = 0; i < 15; i++){
        $scope.totalReputations.push({
          turn: 15 - i,
          ai: {
            reputation: Math.random() * 30,
            votes: Math.random() * 30
          },
          human: {
            reputation: Math.random() * 30,
            votes: Math.random() * 30
          }
        });
      }
    }

    //mockData();


    $scope.onPreparationDone = function(){
      $scope.state = 'sim';
    };
  });
