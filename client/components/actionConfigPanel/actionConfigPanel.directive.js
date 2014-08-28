'use strict';

angular.module('partyanimalsDraftApp')
  .directive('actionConfigPanel', function () {
    return {
      templateUrl: 'components/actionConfigPanel/actionConfigPanel.html',
      restrict: 'E',
      transclude: true,
      scope: {
        selectedActivity: '=',
        staffers: '=',
        human: '=',
        done: '=',
        cancel: '='
      },
      link: function (scope) {
        scope.onOkClicked = function(){
          //TODO: add details of the action here
          scope.done();
        };
      }
    };
  });
