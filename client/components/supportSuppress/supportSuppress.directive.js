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
        done: '=',
        human: '=',
        ai: '='
      },
      link: function (scope) {
        scope.showStaffChoice = false;
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

        var updateCosts = function(){
          scope.costSupport = 0;
          scope.costSuppress = 0;
          _.forEach(scope.districts, function(district){
            if(district.humanActors.length > 0){
              _.forEach(district.humanActors, function(actor){
                if(actor.activity === 'suppress'){
                  scope.suppressThis(district);
                }else if(actor.activity === 'support'){
                  scope.supportThis(district);
                }
              });
            }
          });
        };

        scope.$watch('kapitans', function(){

          if(scope.kapitans && scope.districts){
              attachKapitans();
          }
        });

        scope.$watch('districts', function(){
          if(scope.kapitans && scope.districts){
            _.forEach(scope.districts, function(d){
              d.humanActors = [];
            });
              attachKapitans();
          }
        });

        scope.$watch('human', function(){
          scope.human.activity = null;
          _.forEach(scope.human.staff, function(staff){
            staff.activity = null;
          });
        });

        scope.shouldDisable = function(staffer){
          var isDisabled = false;
          if(staffer.activity){ //if staffer is already assigned
            isDisabled = true;
          }
          return isDisabled;
        };

        scope.selectStaff = function(staff){

          scope.human.selected = false;
          _.forEach(scope.human.staff, function(s){
            s.selected = false;
          });
          if(staff.activity){
            return;
          }
          staff.selected = true;
        };

        scope.onStaffDone = function(){
          var selectedStaff = scope.human.selected ? scope.human : null;
          if(!selectedStaff){
            selectedStaff = _.find(scope.human.staff, function(s){
              return s.selected && !s.activity;
            });
          }

          if(selectedStaff){
            var district = _.find(scope.districts, function(d){
              return d.selected;
            });
            selectedStaff.activity = district.manipulate > 0 ? 'support' : 'suppress';
            district.humanActors.push(selectedStaff);
          }
          scope.showStaffChoice = false;
          updateCosts();
        };

        scope.clickOnDistrict = function(district, index){
          scope.showStaffChoice = true;
          scope.selectedDistrictMargin = index * 40;
          _.forEach(scope.districts, function(d){
            d.selected = false;
            d.manipulate = 1;
          });
          var defaultExists = false;
          _.forEach(scope.human.staff, function(s){
            if(!s.activity){
              s.selected = true;
              defaultExists = true;
              return false;
            }
          });
          if(!defaultExists && !scope.human.activity){
            scope.human.selected = true;
          }
          district.selected = true;
          scope.selectedDistrict = district;
        };

        scope.onDone = function(){
          scope.done();
        };

        scope.removeStaff = function(staff, district){
          staff.activity = null;
          staff.selected = false;
          var index = _.findIndex(district.humanActors, function(s){
            return s.name === staff.name;
          });
          district.humanActors.splice(index,1);
          updateCosts();
        };

        scope.suppressThis = function(district){
          scope.costSuppress += 1000 * district.goldCostModifier;
        };

        scope.supportThis = function(district){
          scope.costSupport += 1000 * district.goldCostModifier;
        };
      }
    };
  });
