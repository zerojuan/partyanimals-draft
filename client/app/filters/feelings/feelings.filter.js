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
  })
  .filter('feelingstowards', function(){
    return function(feeling){
      if(feeling <= 10){
        return 'Hates';
      }else if(feeling > 10 && feeling <= 25){
        return 'Distrusts';
      }else if(feeling > 25 && feeling <= 45){
        return 'Dislikes';
      }else if(feeling > 45 && feeling <= 70){
        return 'is Indifferent towards';
      }else if(feeling > 70 && feeling <= 85){
        return 'Likes';
      }else if(feeling > 85 && feeling <= 95){
        return 'Trusts';
      }else if(feeling > 95){
        return 'Loves';
      }
    };
  })
  .filter('feelingstomodifier', function(){
    return function(feeling){
      if(feeling <= 10){
        return -0.5;
      }else if(feeling > 10 && feeling <= 25){
        return -0.25;
      }else if(feeling > 25 && feeling <= 45){
        return -0.1;
      }else if(feeling > 45 && feeling <= 70){
        return 0;
      }else if(feeling > 70 && feeling <= 85){
        return 0.1;
      }else if(feeling > 85 && feeling <= 95){
        return 0.2;
      }else if(feeling > 95){
        return 0.3;
      }
    };
  })
  .filter('feelingscolor', function(){
    var color = d3.scale.linear()
        .domain([0, 50, 100])
        .range(['red', '#ccc', 'green']);
    return function(feeling){
      return color(feeling);
    };
  })
  .filter('feelingstorollmodifier', function(){
    return function(feeling){
      if(feeling <= 10){
        return -50;
      }else if(feeling > 10 && feeling <= 25){
        return -25;
      }else if(feeling > 25 && feeling <= 45){
        return -15;
      }else if(feeling > 45 && feeling <= 70){
        return 0;
      }else if(feeling > 70 && feeling <= 85){
        return 15;
      }else if(feeling > 85 && feeling <= 95){
        return 25;
      }else if(feeling > 95){
        return 50;
      }
    };
  });
