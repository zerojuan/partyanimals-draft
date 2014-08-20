'use strict';

angular.module('partyanimalsDraftApp')
  .service('Utils', function Utils() {
    this.combineDistrictName = function(name){
      return name.toLowerCase().split(' ').join('');
    };
  });
