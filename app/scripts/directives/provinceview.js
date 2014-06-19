'use strict';

angular.module('partyanimalsDraftApp')
  .directive('provinceView', function () {
    return {
      templateUrl: '/views/partials/province-view.html',
      restrict: 'E',
      replace: true,
      scope: {
        districts : '=',
        selectedDistrict  : '='
      },
      link: function postLink(scope, element, attrs) {
        scope.selected = function(district){
          if(scope.selectedDistrict){
            scope.selectedDistrict.selected = false;
          }
          scope.selectedDistrict = district;
          district.selected = true;
        }
      }
    };
  });
