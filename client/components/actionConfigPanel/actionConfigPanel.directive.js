'use strict';

angular.module('partyanimalsDraftApp')
  .directive('actionConfigPanel', function () {
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
            return true;
          }

          return false;
        };

        scope.onOkClicked = function(){
          var activity = angular.copy(scope.selectedActivity);
          scope.details.hoursPassed = 0;
          scope.details.hours = activity.cost.hours;
          activity.details = scope.details;
          scope.done(activity);
        };
      }
    };
  });
