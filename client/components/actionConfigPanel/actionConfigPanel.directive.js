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
        scope.$watch('state', function(){
          if(scope.state === 'ACTIVITY'){
            scope.details.actor = null;
            scope.details.cost = scope.selectedActivity.cost.gold;
            // if(scope.localStaffers && scope.localStaffers.length > 0){
            //   _.forEach(scope.localStaffers, function(staff){
            //     staff.selected = false;
            //   });
            // }
            scope.localStaffers = [];
            var localHuman = angular.copy(scope.human);
            localHuman.selected = false;
            scope.localStaffers.push(localHuman);
            _.forEach(scope.staffers, function(staffer){
              var s = angular.copy(staffer);
              s.selected = false;
              scope.localStaffers.push(s);
            });
          }
        });


        scope.selectStaffer = function(selectedStaffer){
          if(selectedStaffer.activity){
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
          scope.details.hoursLeft = 0;
          scope.details.hours = activity.cost.hours;
          activity.details = scope.details;
          scope.done(activity);
        };
      }
    };
  });
