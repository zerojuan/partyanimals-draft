'use strict';

/**
 * @ngdoc filter
 * @name partyanimalsDraftApp.filter:messageparser
 * @function
 * @description
 * # messageparser
 * Filter in the partyanimalsDraftApp.
 */
angular.module('partyanimalsDraftApp')
  .filter('messageparser', function () {
    return function (input, values) {
      console.log(input, values);
      return input.replace('$issue$', values.issue).replace('$district$', values.district);
    };
  });
