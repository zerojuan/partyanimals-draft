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
          scope.fillerSubstories = [];
          scope.hasRemainder = false;
          scope.addFillerNews = false;
          var totalActors = 0;

          //TODO: render news items with proper layout
          _.forEach(scope.actors, function(actor){
            if(actor.team === 'AI'){
              actor.headline = NewspaperService.createHeadline(actor, true);
              actor.story = NewspaperService.createStory(actor, true);
              if(actor.isCandidate){
                scope.aiCandidate = actor;
              }else{
                totalActors++;
                scope.aiActors.push(actor);
              }
            }else{
              actor.headline = NewspaperService.createHeadline(actor, false);
              actor.story = NewspaperService.createStory(actor, true);
              if(actor.isCandidate){
                scope.humanCandidate = actor;
              }else{
                totalActors++;
                scope.humanActors.push(actor);
              }
            }
          });



          if(totalActors % 3 > 0){
            scope.hasRemainder = true;
            if(totalActors % 3 === 1){
              scope.fillerSubstories.push(NewspaperService.createFillerStory());
            }
          }

          scope.isBoth = scope.aiCandidate && scope.humanCandidate;
          scope.isNone = !scope.aiCandidate && !scope.humanCandidate;
          if(scope.actors.length === 0 || scope.isNone){
            scope.fillerStory = NewspaperService.createFillerHeadline();
            if(scope.actors.length === 0){
              for(var i = 0; i < 3; i++){
                scope.fillerSubstories.push(NewspaperService.createFillerStory());
              }
            }
          }
        });
      }
    };
  });
  angular.module('partyanimalsDraftApp')
    .directive('dailyPaperItem', function(NewspaperService){
      return {
        template: '<h1></h1>',
        restrict: 'E',
        scope: {
          actors: '=',
          days: '='
        },
        link: function(scope){

        }
      };
    });
  angular.module('partyanimalsDraftApp')
    .directive('emptyNewsDay', function(NewspaperService){
      return {
        template: '<div><h1>{{headline}}</h1>{{generatedNews}}</div>',
        restrict: 'E',
        link: function(scope){

        }
      };
    });
