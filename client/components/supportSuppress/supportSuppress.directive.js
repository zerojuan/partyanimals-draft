'use strict';

angular.module('partyanimalsDraftApp')
  .directive('supportSuppress', function (GameState) {
    return {
      templateUrl: 'components/supportSuppress/supportSuppress.html',
      restrict: 'E',
      scope: {
        cash: '=',
        kapitans: '=',
        districts: '=',
        done: '='
      },
      link: function (scope) {
        var kapitansAttached = false;
        var attachKapitans = function(){
          if(kapitansAttached){
            return;
          }
          kapitansAttached = true;
          _.forEach(scope.districts, function(val){
            val.manipulate = 0;
            val.humanProjectedVote = GameState.projectVote(val.population, val.humanReputation);
            val.aiProjectedVote = GameState.projectVote(val.population, val.aiReputation);
            val.kapitan = findKapitan(val.kapitanId);
          });
          scope.costSuppress = 0;
          scope.costSupport = 0;
        };

        var findKapitan = function(id){
          return _.find(scope.kapitans, function(val){
            return val.id === id;
          });
        };

        scope.$watch('kapitans', function(){
          if(scope.kapitans && scope.districts){
              attachKapitans();
          }
        });

        scope.$watch('districts', function(){
          if(scope.kapitans && scope.districts){
              attachKapitans();
          }
        });

        scope.onDone = function(){
          scope.done();
        };

        scope.suppressThis = function(district){
          if(district.manipulate === 0){
            district.manipulate = -1;
            scope.costSuppress += 1000 * district.goldCostModifier;
          }else if(district.manipulate === 1){
            district.manipulate = -1;
            scope.costSupport -= 1000 * district.goldCostModifier;
            scope.costSuppress += 1000 * district.goldCostModifier;
          }else{
            district.manipulate = 0;
            scope.costSuppress -= 1000 * district.goldCostModifier;
          }

        };

        scope.supportThis = function(district){
          if(district.manipulate === 0){
            district.manipulate = 1;
            scope.costSupport += 1000 * district.goldCostModifier;
          }else if(district.manipulate === -1){
            district.manipulate = 1;
            scope.costSupport += 1000 * district.goldCostModifier;
            scope.costSuppress -= 1000 * district.goldCostModifier;
          }else{
            district.manipulate = 0;
            scope.costSupport -= 1000 * district.goldCostModifier;
          }

        };
      }
    };
  });
