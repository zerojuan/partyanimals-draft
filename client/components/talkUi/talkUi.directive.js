'use strict';

angular.module('partyanimalsDraftApp')
  .directive('talkUi', function (GameState) {
    return {
      require: '^activitySim',
      templateUrl: 'components/talkUi/talkUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;
        scope.onDone = function(){
          simCtrl.setDone(result);
        };

        scope.gotoNext = function(id){
          if(id > 0){
            scope.dialog = GameState.getDialog(id, scope.event);
            return;
          }
          scope.done = true;
          scope.talkState = 'done';
          scope.onDone();
        };

        scope.onSelect = function(character){
          scope.selectedCharacter = character;
          scope.talkState = 'talk';
          result.kapitan = character;
          scope.event = GameState.getEvent(character);
          scope.dialog = GameState.getDialog(0, scope.event);
        };

        scope.$watch('activity', function(){
          scope.done = false;

          scope.talkState = 'choose';
          result = {
            type: 'TALK',
            cost: scope.activity.cost
          };
        });
      }
    };
  });
