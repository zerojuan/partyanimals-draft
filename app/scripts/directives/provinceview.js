'use strict';

angular.module('partyanimalsDraftApp')
  .directive('provinceView', function () {
    return {
      templateUrl: '/partials/province-view.html',
      restrict: 'E',
      replace: true,
      scope: {
        districts : '=',
        selectedDistrict  : '=',
        changeSelected : '=',
        showReputation: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.selected = function(district){
          scope.changeSelected(district);
        };
      }
    };
  });
