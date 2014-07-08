'use strict';

/**
 * @ngdoc directive
 * @name partyanimalsDraftApp.directive:statui
 * @description
 * # statui
 */
angular.module('partyanimalsDraftApp')
  .directive('statUi', function ($filter) {
    return {
      require: '^activitySim',
      templateUrl: 'partials/stat-ui.html',
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
          scope.done = false;
          scope.success = false;
          attributeFormula = $filter('attributeparser')(scope.activity.effect.attr);
          var effectFormula = $filter('formulaparser')(scope.activity.effect.modifier);
          console.log('Effect formula:',effectFormula);
          modifier = effectFormula.formula(effectFormula.value);
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
            issueIndex: scope.selectedIndex
          };
          scope.done = true;
          scope.success = true;
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
