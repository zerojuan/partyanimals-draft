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
      var input = input.match(/([A-z,0-9]+)|([+-/])/g) || [];
      var formula = null;
      if(input[2] === 'amod'){
        formula = function(value, actionResult, successChance){
          return value + ((actionResult-successChance)*5);
        }
      }else if(input[2] === 'dmod'){
        formula = function(value, districtMod){
          return value + (districtMod*10);
        }
      }
      return {
        value: parseInt(input[0]),
        formula: formula
      };
    };
  })
  .filter('attributeparser', function(){
    return function(input){
      var parsed = input.match(/(vs)|([A-z]+)/g) || [];
      console.log(parsed);
      if(parsed[0] === 'vs'){
        return {
          value: parsed[1].toLowerCase(),
          isVs: true
        };
      }else{
        return {
          value: input.toLowerCase(),
          isVs: false
        };
      }
    };
  });
