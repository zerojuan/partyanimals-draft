'use strict';

angular.module('partyanimalsDraftApp')
  .directive('actionConfigPanel', function ($filter) {
    return {
      templateUrl: 'components/actionConfigPanel/actionConfigPanel.html',
      restrict: 'E',
      transclude: true,
      scope: {
        selectedActivity: '=',
        staffers: '=',
        human: '=',
        done: '=',
        cancel: '=',
        state: '='
      },
      link: function (scope) {
        scope.details = {
          actor: null,
          cost: 0
        };

        scope.showPossibleIndex = -1;
        scope.statAvailable = 1;
        scope.tempHumanStance = [];
        scope.tempAIStance = [];

        var attributeFormula;
        var modifier = 1;

        function shouldDisable(staffer, activity){
          var isDisabled = false;
          if(staffer.activity){ //if staffer is already assigned
            isDisabled = true;
          }else{
            _.forEach(activity.restrictions, function(restriction){
              if(restriction === 'CANDIDATE_ONLY'){
                isDisabled = true;
                return false;
              }
            });
          }
          return isDisabled;
        }

        scope.$watch('state', function(){
          if(scope.state === 'ACTIVITY'){
            scope.details.actor = null;
            scope.details.cost = scope.selectedActivity.cost.gold;

            scope.localStaffers = [];
            var localHuman = angular.copy(scope.human);
            localHuman.selected = false;
            if(scope.selectedActivity.type !== 'MOVE'){
              localHuman.disabled = scope.selectedActivity.district.name !== localHuman.currentLocation.name;
            }

            scope.localStaffers.push(localHuman);
            _.forEach(scope.staffers, function(staffer){
              var s = angular.copy(staffer);
              s.selected = false;
              s.disabled = shouldDisable(staffer, scope.selectedActivity);

              scope.localStaffers.push(s);
            });

            if(scope.selectedActivity.type === 'STAT'){
              attributeFormula = $filter('attributeparser')(scope.selectedActivity.effect.attr);
              var effectFormula = $filter('formulaparser')(scope.selectedActivity.effect.modifier);
              modifier = effectFormula;

              scope.tempHumanStance = angular.copy(scope.selectedActivity.district.humanStance);
              scope.tempAIStance = angular.copy(scope.selectedActivity.district.aiStance);
            }
          }
        });


        scope.selectStaffer = function(selectedStaffer){
          if(selectedStaffer.disabled){
            return;
          }
          _.forEach(scope.localStaffers, function(staffer){
            if(selectedStaffer.id === staffer.id){
              scope.details.actor = selectedStaffer;
              selectedStaffer.selected = true;
            }else{
              staffer.selected = false;
            }
          });
        };

        scope.getCostModifier = function(){
          //distance between min and max
          var min = scope.selectedActivity.cost.min;
          var max = scope.selectedActivity.cost.max;
          var range = max - min;
          var cost = scope.details.cost - min;
          //min and max percentage
          var minPercentage = 30;
          var maxPercentage = 80;
          var percentageRange = maxPercentage - minPercentage;
          var costPercentage = (percentageRange * (cost / range)) + minPercentage;
          return costPercentage;
        }

        scope.getKapitanModifier = function(){
          var kapitanModifier = $filter('feelingstomodifier')(scope.selectedActivity.district.kapitan.humanRelations);
          return kapitanModifier * 100;
        }

        scope.isReady = function(){
          if(scope.details.actor){
            if(scope.selectedActivity.type === 'STAT'){
              return scope.selectedIndex >= 0;
            }else{
              return true;
            }
          }

          return false;
        };

        scope.onOkClicked = function(){
          var activity = angular.copy(scope.selectedActivity);
          scope.details.daysPassed = 0;
          scope.details.days = activity.cost.days;
          activity.details = scope.details;
          if(scope.selectedActivity.type === 'STAT'){
            activity.details.selectedIssue = scope.selectedIndex;
            activity.details.isVs = attributeFormula.isVs;
          }
          scope.done(activity);
        };

        scope.hidePossible = function(){
          scope.showPossibleIndex = -1;
        };

        scope.showPossible = function(index){
          scope.showPossibleIndex = index;
        };

        scope.shouldDisableStat = function(index, issue){
          if(scope.selectedIndex >= 0){
            return scope.selectedIndex !== index;
          }
          if(scope.selectedActivity.type === 'STAT' && attributeFormula.isVs){
            return scope.tempAIStance[index] === 0;
          }else{
            return scope.tempHumanStance[index] === issue.level;
          }
        };

        scope.raiseStats = function(index){
          if(scope.selectedIndex === index){
            if(attributeFormula.isVs){
              scope.tempAIStance[index] -= modifier;
            }else{
              scope.tempHumanStance[index] -= modifier;
            }
            scope.selectedIndex = -1;
          }else{
            if(attributeFormula.isVs){
              scope.tempAIStance[index] += modifier;
            }else{
              scope.tempHumanStance[index] += modifier;
            }
            scope.selectedIndex = index;
          }
        };
      }
    };
  });
