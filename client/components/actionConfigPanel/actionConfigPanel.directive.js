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
          if(staffer.activity){
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
          scope.details.hoursPassed = 0;
          scope.details.hours = activity.cost.hours;
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
          if(attributeFormula.isVs){
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
