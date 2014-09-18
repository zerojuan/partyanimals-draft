'use strict';

angular.module('partyanimalsDraftApp')
  .directive('dailyPaper', function (NewspaperService) {
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
          //TODO: render news items with proper layout
          _.forEach(scope.actors, function(actor){
            if(actor.team === 'AI'){
              actor.headline = NewspaperService.createHeadline(actor, true);
              if(actor.isCandidate){
                scope.aiCandidate = actor;
              }else{
                scope.aiActors.push(actor);
              }
            }else{
              actor.headline = NewspaperService.createHeadline(actor, false);
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
