'use strict';

angular.module('partyanimalsDraftApp')
  .directive('notification', function () {
    return {
      templateUrl: 'components/notification/notification.html',
      restrict: 'E',
      scope: {
        actor: '='
      },
      link: function postlink(scope){
        scope.getDescription = function(actor){
          var actionName = actor.activity.name;
          if(actionName === 'Bribe'){
            return 'bribed someone';
          }else if(actionName === 'Educate'){
            return 'educated someone';
          }else if(actionName === 'Smear'){
            return 'smeared someone';
          }else if(actionName === 'Sortie'){
            return 'sortied someone';
          }else if(actionName === 'Contest'){
            return 'contested someone';
          }else if(actionName === 'Talk to Kapitan'){
            return 'talked to someone';
          }
        };
      }
    };
  });
