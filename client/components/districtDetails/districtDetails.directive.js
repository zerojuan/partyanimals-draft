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
        ai: '='
      },
      link: function (scope, element, attrs) {
      }
    };
  });
