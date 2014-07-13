'use strict';

/**
 * @ngdoc function
 * @name partyanimalsDraftApp.controller:AlertCtrl
 * @description
 * # AlertCtrl
 * Controller of the partyanimalsDraftApp
 */
angular.module('partyanimalsDraftApp')
  .controller('AlertCtrl', function ($scope) {
    $scope.closeAlert = function(index) {
      $scope.config.alerts.splice(index, 1);
    };
  });
