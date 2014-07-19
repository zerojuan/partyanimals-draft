'use strict';

angular.module('partyanimalsDraftApp')
  .directive('talkUi', function ($filter, GameState) {
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
        var totalEffect;
        var total;
        var parseFinalMessage = function(){
          //based on total message
          total = $filter('totaleffectparser')(totalEffect);
          if(total.reputation > 0){
            scope.finalMessage = 'Talking to '+scope.selectedCharacter.name+' went well.';
          }else if(total.reputation < 0){
            scope.finalMessage = scope.selectedCharacter.name+'\'s opinion on you dipped slightly.';
          }else{
            scope.finalMessage = 'The meeting was somewhat uneventful.';
          }
        };

        scope.onDone = function(){
          result.totalEffect = totalEffect;
          result.total = total;
          simCtrl.setDone(result);
        };

        scope.gotoNext = function(id, effect){
          if(effect){
            var theEffects = $filter('eventeffectparser')(effect);
            totalEffect.push(theEffects);
          }
          if(id > 0){
            scope.dialog = GameState.getDialog(id, scope.event);
            return;
          }
          scope.done = true;
          scope.talkState = 'done';
          parseFinalMessage();
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
          totalEffect = [];
          scope.talkState = 'choose';
          result = {
            type: 'TALK',
            district: scope.activity.location,
            cost: scope.activity.cost
          };
        });
      }
    };
  });
