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
      _.forEach($scope.districts, function(val){
        val.aiProjectedVote = Math.floor(Math.random() * 500 + 1000);
        val.humanProjectedVote = Math.floor(Math.random() * 500 + 1000);
      });
      $scope.human.totalCash = -1000;
      $scope.ai.totalCash = 1000;
    }

    mockData();

    $scope.onOfficialVote = function(district, vote){

    };

    $scope.onPreparationDone = function(){
      $scope.state = 'sim';
    };
  });
