'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:sortieui
 * @description
 * # sortieui
 */
angular.module('partyanimalsDraftApp')
  .directive('sortieUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'partials/sortie-ui.html',
      restrict: 'E',
      replace: true,
      scope: {
        activity: '='
      },
      link: function postLink(scope, element, attrs, simCtrl) {
        var result;

        scope.onDone = function(){
          scope.done = true;
          scope.success = true;
          simCtrl.setDone(result);
        };

        scope.$watch('activity', function(){
          if(scope.activity){
            //loop through activity.location's human stance
            var player = simCtrl.getPlayer();

            var totalReputation = 0;
            var maxIndex, maxValue, minIndex, minValue;
            maxIndex = maxValue = minIndex = minValue = 0;
            scope.activity.location.humanStance.forEach(function(val, i){
              var dataForCheck = {
                random: Math.random() * 100,
                PKRm: 1,
                em: 10,
                OKRm: 1
              };
              var dataForActionDifficulty = {
                BD: scope.activity.difficulty,
                IDM: val,
                em: 10,
                OKRm: 1
              };

              var actionCheck = $filter('formulaparser')(scope.activity.actionCheck, dataForCheck);
              var actionDifficulty = $filter('formulaparser')(scope.activity.actionDifficulty, dataForActionDifficulty);

              console.log('Check Action '+ scope.activity.name + ': Difficulty('+actionDifficulty+') vs Dice('+actionCheck+')');
              //only add the result value if you are successful
              var resultValue = $filter('formulaparser')(scope.activity.effect.modifier, {AR: Math.floor(actionCheck), AD: actionDifficulty});
              if(actionCheck > actionDifficulty){
                totalReputation += resultValue;
              }

              if(resultValue > maxValue){
                maxValue = resultValue;
                maxIndex = i;
              }

              if(i === 0 || resultValue < minValue){
                minValue = resultValue;
                minIndex = i;
              }
            });

            scope.success = true;
            scope.stats = {
              best: player.issueStats[maxIndex].name,
              bestValue: maxValue,
              worst: player.issueStats[minIndex].name,
              worstValue: minValue
            };

            result = {
              value: totalReputation,
              success: scope.success,
              type: 'SORTIE',
              district: scope.activity.location,
              name: scope.activity.name,
              stats: scope.stats
            };
          }
        });
      }
    };
  });
