'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:reputationui
 * @description
 * # reputationui
 */
angular.module('partyanimalsDraftApp')
  .directive('reputationUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'partials/reputation-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;
        scope.onDone = function(){
          scope.done = true;
          simCtrl.setDone(result);
        };

        scope.$watch('activity', function(){
          if(scope.activity){
            scope.done = false;
            //check the possible values here
            var attributeParser = $filter('attributeparser')(scope.activity.effect.attr);
            var dataForCheck = {
              random: Math.random() * 100,
              PKRm: 1,
              em: 10,
              OKRm: 1
            };
            var dataForActionDifficulty = {
              BD: scope.activity.difficulty,
              em: 10,
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

            var resultValue = $filter('formulaparser')(scope.activity.effect.modifier, {AR: Math.floor(actionCheck), AD: actionDifficulty});

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
