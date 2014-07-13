'use strict';

angular.module('partyanimalsDraftApp')
  .directive('provinceView', function () {
    return {
      templateUrl: 'components/provinceView/provinceView.html',
      restrict: 'E',
      replace: true,
      scope: {
        districts : '=',
        selectedDistrict  : '=',
        changeSelected : '=',
        showReputation: '@'
      },
      link: function postLink(scope) {
        scope.selected = function(district){
          scope.changeSelected(district);
        };
      }
    };
  });
