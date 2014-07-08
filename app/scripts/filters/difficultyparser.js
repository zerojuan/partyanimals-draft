'use strict';

/**
 * @ngdoc filter
 * @name partyanimalsDraftApp.filter:difficultyparser
 * @function
 * @description
 * # difficultyparser
 * Filter in the partyanimalsDraftApp.
 */
angular.module('partyanimalsDraftApp')
  .filter('difficultyparser', function () {
    return function (input) {
      if(input < 20){
        return 'VERY HIGH';
      }else if(input < 30){
        return 'HIGH';
      }else if(input < 45){
        return 'NORMAL';
      }else{
        return 'LOW';
      }
    };
  });
