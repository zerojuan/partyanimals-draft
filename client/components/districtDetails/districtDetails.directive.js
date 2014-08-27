'use strict';

angular.module('partyanimalsDraftApp')
  .directive('districtDetails', function () {
    return {
      templateUrl: 'components/districtDetails/districtDetails.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        selectedDistrict: '=',
        human: '=',
        ai: '=',
        closeHandler: '=',
        onActivitySelected: '='
      },
      link: function (scope, element, attrs) {
        scope.selectedAction = function(action){
          scope.onActivitySelected(action);
        };
      }
    };
  });
