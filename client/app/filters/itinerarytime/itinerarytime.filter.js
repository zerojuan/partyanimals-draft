'use strict';

angular.module('partyanimalsDraftApp')
  .filter('itinerarytime', function () {
    return function (input) {
      input = parseInt(input);
      if(input < 12){
        return input + ' AM';
      }else if(input === 12){
        return input + ' PM ';
      }else if(input === 24){
        return  '12 AM';
      }else{
        return (input%12) + ' PM ';
      }
    };
  });
