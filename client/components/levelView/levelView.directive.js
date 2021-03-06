'use strict';

angular.module('partyanimalsDraftApp')
  .directive('levelView', function () {
    return{
      templateUrl: 'components/levelView/levelView.html',
      restrict: 'E',
      scope: {
        base: '=',
        lvl: '=',
        direction: '@',
        type: '@'
      },
      link: function postLink(scope) {

        scope.$watch('lvl', function(){
          scope.levelArray = [];
          for(var i = 0; i < scope.lvl; i++){
            scope.levelArray.push(i);
          }
        });

        scope.$watch('base', function(){
          scope.baseArray = [];
          for(var i = 0; i < scope.base; i++){
            scope.baseArray.push(i);
          }
        });
      }
    };
  });
