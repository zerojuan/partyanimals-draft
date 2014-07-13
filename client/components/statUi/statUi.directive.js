'use strict';

angular.module('partyanimalsDraftApp')
  .directive('statUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'components/statUi/statUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        //select stat to change,
        scope.issues = simCtrl.getIssues();
        scope.player = simCtrl.getPlayer();

        scope.showPossibleIndex = -1;
        scope.statAvailable = 1;

        var attributeFormula;
        var modifier = 1;

        scope.$watch('activity', function(){
          scope.selectedIndex = -1;
          scope.issues = simCtrl.getIssues();
          scope.player = simCtrl.getPlayer();
          scope.ai = simCtrl.getAI();
          scope.done = false;
          scope.success = false;
          attributeFormula = $filter('attributeparser')(scope.activity.effect.attr);
          var effectFormula = $filter('formulaparser')(scope.activity.effect.modifier);
          console.log('Effect formula:',effectFormula);
          modifier = effectFormula;
          console.log('Modifier: ', modifier);
        });

        //show stats
        scope.onDone = function(){

          var value = 1;
          if(attributeFormula.isVs){
            value = -1;
          }
          var result = {
            type: 'STAT',
            district: scope.activity.location,
            value: value,
            name: scope.activity.name,
            issueIndex: scope.selectedIndex,
          };
          scope.done = true;
          scope.success = true;
          if(scope.selectedIndex === -1){
            scope.doneMessage = 'Lacking direction, your activity failed.';
            scope.success = false;
            result.cost = scope.activity.cost;
            simCtrl.setDone(result);
            return;
          }

          //success or fail?
          var dataForCheck = {
            random: Math.random() * 100,
            PKRm: 1,
            em: 10
          };
          var dataForActionDifficulty = {
            BD: scope.activity.difficulty,
            em: 10,
            ITL: scope.activity.location.humanStance[scope.selectedIndex],
            IDM: scope.activity.location.issues[scope.selectedIndex],
            OKRm: 1
          };

          var actionCheck = $filter('formulaparser')(scope.activity.actionCheck, dataForCheck);
          var actionDifficulty = $filter('formulaparser')(scope.activity.actionDifficulty, dataForActionDifficulty);

          console.log('Check Action '+ scope.activity.name + ': Difficulty('+actionDifficulty+') vs Dice('+actionCheck+')');

          if(actionCheck > actionDifficulty){
            scope.success = true;
          }else{
            scope.success = false;
          }
          var parseVal = {
            issue: scope.player.issueStats[scope.selectedIndex].name,
            district: scope.activity.location.name
          };
          var message = '';
          if(scope.success){
            message = $filter('messageparser')(scope.activity.text.success[0], parseVal);
          }else{
            message = $filter('messageparser')(scope.activity.text.fail[0], parseVal);
          }
          scope.doneMessage = message;
          result.cost = scope.activity.cost;
          result.success = scope.success;
          simCtrl.setDone(result);
        };

        scope.showPossible = function(index){
          scope.showPossibleIndex = index;
        };

        scope.hidePossible = function(){
          scope.showPossibleIndex = -1;
        };

        scope.shouldDisable = function(index, issue){
          if(scope.selectedIndex >= 0){
            return scope.selectedIndex !== index;
          }
          if(attributeFormula.isVs){
            return scope.activity.location.aiStance[index] === 0;
          }else{
            return scope.activity.location.humanStance[index] === issue.level;
          }
        };

        scope.raiseStats = function(index){
          if(scope.selectedIndex === index){
            if(attributeFormula.isVs){
              scope.activity.location.aiStance[index] -= modifier;
            }else{
              scope.activity.location.humanStance[index] -= modifier;
            }
            scope.selectedIndex = -1;
          }else{
            if(attributeFormula.isVs){
              scope.activity.location.aiStance[index] += modifier;
            }else{
              scope.activity.location.humanStance[index] += modifier;
            }
            scope.selectedIndex = index;
          }
        };
      }
    };
  });
