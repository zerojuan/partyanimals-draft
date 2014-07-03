'use strict';

/**
 * @ngdoc filter
 * @name partyanimalsDraftApp.filter:formulaparser
 * @function
 * @description
 * # formulaparser
 * Filter in the partyanimalsDraftApp.
 */
angular.module('partyanimalsDraftApp')
  .filter('formulaparser', function () {
    return function (input) {
      var input = input.match(/([A-z,0-9]*)|([+-/])/g) || [];
      console.log('This is the input',input);
      return {
        value: 30,
        formula: function(value, districtMod){
          return districtMod+30;
        }
      };
    };
  });
