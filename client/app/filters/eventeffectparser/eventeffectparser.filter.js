'use strict';

angular.module('partyanimalsDraftApp')
  .filter('eventeffectparser', function () {
    return function (input) {

      return 'eventeffectparser filter: ' + input;
    };
  })
  .filter('eventeffecttooltip', function(){
    return function(input){
      if(!input){
        return;
      }
      var effects = input.split(',');
      var html = '<ul class="list-unstyled">';
      effects.forEach(function(val){
        var str = val.replace('GOLD', 'Gold')
                    .replace('MORALITY', 'Morality:')
                    .replace('BRIBEE', 'Bribee:')
                    .replace('REL', 'Relationship:')
                    .replace('REL_KAPITAN', 'Relationship with the other character:')
                    .replace('CARD', 'Situation:')
                    .replace('OISSUE0', 'Opponent\'s Education: ')
                    .replace('ISSUE0', 'Education: ');
        html+='<li>';
        html+=str;
        html+='</li>';
      });
      html+='</ul>';
      return html;
    };
  });
