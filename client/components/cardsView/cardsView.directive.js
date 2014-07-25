'use strict';

angular.module('partyanimalsDraftApp')
  .directive('cardsView', function () {
    return {
      templateUrl: 'components/cardsView/cardsView.html',
      restrict: 'E',
      scope: {
        cards: '='
      },
      link: function (scope, element, attrs) {
      }
    };
  });
