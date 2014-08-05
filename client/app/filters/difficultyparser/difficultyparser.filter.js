'use strict';

angular.module('partyanimalsDraftApp')
  .filter('difficultyparser', function () {
    return function (input) {
      if(input < 20){
        return 'VERY EASY';
      }else if(input < 30){
        return 'EASY';
      }else if(input < 45){
        return 'NORMAL';
      }else{
        return 'HARD';
      }
    };
  })
  .filter('demandparser', function(){
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
