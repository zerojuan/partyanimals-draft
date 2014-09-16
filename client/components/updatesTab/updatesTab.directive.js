'use strict';

angular.module('partyanimalsDraftApp')
  .directive('updatesTab', function () {
    return {
      templateUrl: 'components/updatesTab/updatesTab.html',
      restrict: 'E',
      scope: {
        updates: '='
      },
      link: function (scope) {
        scope.countSeen = function(){
          return _.reduce(scope.updates, function(total, update){
            return !update.seen ? total+=1 : total;
          }, 0);
        };
      }
    };
  });
