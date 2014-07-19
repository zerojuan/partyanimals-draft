'use strict';

angular.module('partyanimalsDraftApp')
  .directive('reputationUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'components/reputationUi/reputationUi.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;
        scope.onDone = function(){
          scope.done = true;
          result.cost = scope.activity.cost;
          simCtrl.setDone(result);
        };

        scope.$watch('activity', function(){
          if(scope.activity){
            scope.done = false;
            //check the possible values here
            var attributeParser = $filter('attributeparser')(scope.activity.effect.attr);
            var dataForCheck = {
              random: Math.random() * 100,
              PKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.humanRelations),
              em: 10,
              OKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.aiRelations)
            };
            var dataForActionDifficulty = {
              BD: scope.activity.difficulty,
              em: 10,
              OKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.aiRelations)
            };

            var actionCheck = $filter('formulaparser')(scope.activity.actionCheck, dataForCheck);
            var actionDifficulty = $filter('formulaparser')(scope.activity.actionDifficulty, dataForActionDifficulty);

            console.log('Check Action '+ scope.activity.name + ': Difficulty('+actionDifficulty+') vs Dice('+actionCheck+')');
            if(actionCheck > actionDifficulty){
              scope.success = true;
            }else{
              scope.success = false;
            }

            var resultValue = $filter('formulaparser')(scope.activity.effect.modifier, {AR: Math.floor(actionCheck), AD: actionDifficulty});
            if(scope.success && attributeParser.isVs){
              resultValue = resultValue * -1;
            }
            result = {
              value: resultValue,
              success: scope.success,
              type: 'REPUTATION',
              district: scope.activity.location,
              name: scope.activity.name,
              isVs: attributeParser.isVs
            };

            if(scope.success){
              scope.doneMessage = scope.activity.text.success[0];
            }else{
              scope.doneMessage = scope.activity.text.fail[0];
            }


          }
        });
      }
    };
  });
