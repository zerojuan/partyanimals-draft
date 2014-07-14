'use strict';

angular.module('partyanimalsDraftApp')
  .filter('feelings', function () {
    return function (feeling) {
      if(feeling <= 10){
        return 'Hate';
      }else if(feeling > 10 && feeling <= 25){
        return 'Distrust';
      }else if(feeling > 25 && feeling <= 45){
        return 'Dislike';
      }else if(feeling > 45 && feeling <= 70){
        return 'Indifferent';
      }else if(feeling > 70 && feeling <= 85){
        return 'Likes';
      }else if(feeling > 85 && feeling <= 95){
        return 'Trusted';
      }else if(feeling > 95){
        return 'Love';
      }
    };
  });
