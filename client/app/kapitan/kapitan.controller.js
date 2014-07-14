'use strict';

angular.module('partyanimalsDraftApp')
  .controller('KapitanCtrl', function ($scope, GameState) {
    $scope.onKapSelected = function(kapitan){
      if($scope.selectedKapitan){
        $scope.selectedKapitan.active = false;
      }
      $scope.selectedKapitan = kapitan;
      $scope.selectedKapitan.active = true;
      //loop through kapitans and check their reputations for human and ai
      angular.forEach($scope.kapitans, function(val, i){
        //compute relationship
        val.feelingsToSelected = val.relations[$scope.selectedKapitan.id];
        val.feelingsForSelected = $scope.selectedKapitan.relations[i];
      });
    };

    $scope.onBackHome = function(){
      if($scope.selectedKapitan){
        $scope.selectedKapitan.active = false;
      }
      $scope.config.state = 'home';
    };

    $scope.$watch('kapitans', function(){
      //divide the kapitans into two
      $scope.localKapitans = $scope.kapitans.filter(function(val){
        return val.type === 'KAPITAN';
      });

      $scope.specialists = $scope.kapitans.filter(function(val){
        return val.type === 'SPECIALIST';
      });
    });
  });
