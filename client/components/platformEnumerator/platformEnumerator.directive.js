'use strict';

angular.module('partyanimalsDraftApp')
  .directive('platformEnumerator', function () {
    return {
      template: '<span><span ng-repeat="platform in platforms"><span ng-show="$last && !$first"> and </span><b>{{platform}}</b></span></span>',
      restrict: 'E',
      replace: true,
      scope: {
        candidate: '='
      },
      link: function (scope) {
        var proposedPlatforms = [];
        _.forEach(scope.candidate.issueStats, function(issue){
          if(issue.level > 0){
            proposedPlatforms.push(issue.name);
          }
        });

        if(proposedPlatforms.length === scope.candidate.issueStats.length){
          scope.platforms = 'Everything';
        }else{
          scope.platforms = proposedPlatforms;
        }

      }
    };
  });
