'use strict';

angular.module('partyanimalsDraftApp')
  .directive('sortieUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'components/sortieUi/sortieUi.html',
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
            scope.results = [];
            scope.activity.location.humanStance.forEach(function(val, i){
              var dataForCheck = {
                random: Math.random() * 100,
                PKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.humanRelations),
                em: 10,
                OKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.aiRelations),
                GCMod: scope.activity.location.goldCostModifier,
                TCMod: scope.activity.location.timeCostModifier,
                KMod: scope.activity.location.kapitanModifier,
                IDM: scope.activity.location.issues[i],
                IDS: val
              };
              var dataForActionDifficulty = {
                BD: scope.activity.difficulty,
                IDM: scope.activity.location.issues[i],
                IDS: val,
                em: 10,
                OKRm: $filter('feelingstorollmodifier')(scope.activity.location.kapitan.aiRelations),
                GCMod: scope.activity.location.goldCostModifier,
                TCMod: scope.activity.location.timeCostModifier,
                KMod: scope.activity.location.kapitanModifier
              };

              var actionCheck = $filter('formulaparser')(scope.activity.actionCheck, dataForCheck);
              var actionDifficulty = $filter('formulaparser')(scope.activity.actionDifficulty, dataForActionDifficulty);

              console.log('Check Action '+ scope.activity.name + ': Difficulty('+actionDifficulty+') vs Dice('+actionCheck+')');
              //only add the result value if you are successful
              var resultValue = $filter('formulaparser')(scope.activity.effect.modifier, {AR: Math.floor(actionCheck), AD: actionDifficulty});
              var proposedValue = actionCheck - actionDifficulty;
              var isIssueSuccessful = false;
              if(actionCheck > actionDifficulty){
                totalReputation += resultValue;
                isIssueSuccessful = true;
              }

              scope.results.push({
                success: isIssueSuccessful,
                name: player.issueStats[i].name,
                value: Math.floor(proposedValue)
              });

              if(proposedValue > maxValue){
                maxValue = proposedValue;
                maxIndex = i;
              }

              if(i === 0 || proposedValue < minValue){
                minValue = proposedValue;
                minIndex = i;
              }
            });

            scope.success = true;
            scope.stats = {
              best: player.issueStats[maxIndex].name,
              bestIndex: maxIndex,
              bestValue: maxValue,
              worst: player.issueStats[minIndex].name,
              worstIndex: minIndex,
              worstValue: minValue
            };

            result = {
              value: totalReputation,
              cost: scope.activity.cost,
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
