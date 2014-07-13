'use strict';

angular.module('partyanimalsDraftApp')
  .filter('formatcost', function () {
    return function (input) {
      if(input === 0){
        return 'FREE';
      }else{
        return '$ ' + input;
      }
    };
  });
