'use strict';

angular.module('partyanimalsDraftApp')
  .directive('issueLevelView', function () {
    return {
      templateUrl: 'components/issueLevelView/issueLevelView.html',
      restrict: 'E',
      scope: {
        base: '=',
        humanLvl: '=',
        aiLvl: '='
      },
      link: function postLink(scope){
        scope.$watch('humanLvl', function(){
          scope.humanArray = [];
          for(var i = 0; i < scope.humanLvl; i++){
            scope.humanArray.push(i);
          }
        });

        scope.$watch('base', function(){
          scope.baseArray = [];
          for(var i = 0; i < scope.base; i++){
            scope.baseArray.push(i);
          }
        });

        scope.$watch('aiLvl', function(){
          scope.aiArray = [];
          for(var i = 0; i < scope.aiLvl; i++){
            scope.aiArray.push(i);
          }
        });
      }
    };
  });
