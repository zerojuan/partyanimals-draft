'use strict';

angular.module('partyanimalsDraftApp')
  .directive('activitiesList', function () {
    return {
      templateUrl: 'components/ActivitiesList/ActivitiesList.html',
      scope: {
        onSelected: '=',
        activities: '='
      },
      restrict: 'E',
      link: function (scope) {
        scope.$watch('activities', function(){
          //regroup to types
          scope.reputations = [];
          scope.stats = [];
          scope.specials = [];
          scope.sortie = null;
          scope.move = null;
          scope.talk = null;
          _.forEach(scope.activities, function(activity){


            if(activity.type === 'SORTIE'){
              scope.sortie = activity;
            }else if(activity.type === 'MOVE'){
              scope.move = activity;
            }else if(activity.type === 'REPUTATION'){
              scope.reputations.push(activity);
            }else if(activity.type === 'STAT'){
              scope.stats.push(activity);
            }else if(activity.type === 'SPECIAL'){
              scope.specials.push(activity);
            }else if(activity.type === 'TALK'){
              scope.talk = activity;
            }
          });
        });
      }
    };
  });
