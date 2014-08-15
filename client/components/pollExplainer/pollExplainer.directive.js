'use strict';

angular.module('partyanimalsDraftApp')
  .directive('pollExplainer', function () {
    return {
      template: '<span><b>{{top}}</b> leads over <b>{{lose}}</b> by <b>{{lead | number:2}}</b>pts in the latest Summer Weather Survey.</span>',
      restrict: 'E',
      replace: true,
      scope: {
        totalReputations: '=',
        ai: '=',
        human: '='
      },
      link: function (scope) {

        scope.$watch('totalReputations', function(){
          if(scope.totalReputations && scope.totalReputations.length > 0){
              scope.topPoll = scope.totalReputations[scope.totalReputations.length-1];
              scope.lead = Math.abs(scope.topPoll.ai.reputation - scope.topPoll.human.reputation);
              if(scope.topPoll.ai.reputation > scope.topPoll.human.reputation){
                scope.top = 'Catorcio';
                scope.lose = 'Mousey';
              }else{
                scope.top = 'Mousey';
                scope.lose = 'Catorcio';
              }
          }
        }, true);
      }
    };
  });
