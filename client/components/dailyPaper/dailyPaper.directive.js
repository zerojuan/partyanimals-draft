'use strict';

angular.module('partyanimalsDraftApp')
  .directive('dailyPaper', function () {
    return {
      templateUrl: 'components/dailyPaper/dailyPaper.html',
      restrict: 'E',
      scope: {
        actors: '=',
        days: '='
      },
      transclude: true,
      link: function (scope) {
        scope.$watch('days', function(){
          //loop through the actors, which team they are
          scope.humanActors = [];
          scope.humanCandidate = null;
          scope.aiActors = [];
          scope.aiCandidate = null;
          _.forEach(scope.actors, function(actor){
            if(actor.team === 'AI'){
              if(actor.isCandidate){
                scope.aiCandidate = actor;
              }else{
                scope.aiActors.push(actor);
              }
            }else{
              if(actor.isCandidate){
                scope.humanCandidate = actor;
              }else{
                scope.humanActors.push(actor);
              }
            }
          });
        });
      }
    };
  });
