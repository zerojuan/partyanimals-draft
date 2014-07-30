'use strict';

angular.module('partyanimalsDraftApp')
  .controller('EndgameCtrl', function ($scope) {

    $scope.state = 'prep';
    $scope.humanVote = 0;
    $scope.aiVote = 0;
    // $scope.totalReputations = [];
    // for(var i = 0; i < 15; i++){
    //   $scope.totalReputations.push({
    //     turn: 15 - i,
    //     ai: {
    //       reputation: Math.random() * 15,
    //       votes: Math.random() * 15
    //     },
    //     human: {
    //       reputation: Math.random() * 15,
    //       votes: Math.random() * 15
    //     }
    //   });
    // }

    $scope.onPreparationDone = function(){
      $scope.state = 'sim';
    };
  });
