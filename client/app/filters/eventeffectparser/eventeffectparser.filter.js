'use strict';

angular.module('partyanimalsDraftApp')
  .filter('eventeffectparser', function () {
    return function (input) {
      var effect = [];
      input.split(',').forEach(function(val){
        var pair = val.split(/(REL|REL_KAPITAN|MORALITY|GOLD)([+-]\d+)/g)
                .filter(function(val){
                  return val !== '';
                });
        var truValue = parseInt(pair[1]);
        if(pair[0] === 'REL'){
          effect.push({
            attr: 'relationship',
            value: truValue
          });
        }else if(pair[0] === 'MORALITY'){
          effect.push({
            attr: 'morality',
            value: truValue
          });
        }else if(pair[0] === 'GOLD'){
          effect.push({
            attr: 'gold',
            value: truValue
          });
        }
      });
      return effect;
    };
  })
  .filter('totaleffectparser', function(){
    return function(input){
      var total = {
        reputation: 0,
        morality: 0,
        gold: 0
      };
      input.forEach(function(effects){
        effects.forEach(function(effect){
          if(effect.attr === 'relationship'){
            total.reputation += effect.value;
          }else if(effect.attr === 'morality'){
            total.morality += effect.value;
          }else if(effect.attr === 'gold'){
            total.gold += effect.value;
          }
        });
      });
      return total;
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
