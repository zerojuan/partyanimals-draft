'use strict';

angular.module('partyanimalsDraftApp')
  .directive('newsItem', function () {
    return {
      templateUrl: 'components/newsItem/newsItem.html',
      restrict: 'E',
      scope: {
        type: '=',
        data: '='
      },
      link: function (scope, element, attrs) {
        
      }
    };
  });
