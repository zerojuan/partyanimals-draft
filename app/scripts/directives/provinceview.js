'use strict';

angular.module('partyanimalsDraftApp')
  .directive('provinceView', function () {
    return {
      templateUrl: '/views/partials/province-view.html',
      restrict: 'E',
      replace: true,
      scope: {
        districts : '=',
        selectedDistrict  : '=',
        changeSelected : '='
      },
      link: function postLink(scope, element, attrs) {
        scope.selected = function(district){
          if(scope.selectedDistrict){
            scope.selectedDistrict.selected = false;
          }else{
            console.log('There is no selected district');
          }
          scope.selectedDistrict = district;
          scope.selectedDistrict.selected = true;
          scope.changeSelected(district);
        }
      }
    };
  });
