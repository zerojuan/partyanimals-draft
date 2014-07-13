'use strict';

angular.module('partyanimalsDraftApp')
  .filter('messageparser', function () {
    return function (input, values) {
      return input.replace('$issue$', values.issue).replace('$district$', values.district);
    };
  });
