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
        //TODO: make a filter for reading formulas
        var formula = $filter('formulaparser')(scope.activity.success);
        console.log('Got this formula from parser: ', formula);
        //roll dice
        //check if diceroll greater than success rate
        scope.onDone = function(){
          simCtrl.setDone();
        }
      }
    };
  });
