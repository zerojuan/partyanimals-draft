'use strict';

angular.module('partyanimalsDraftApp')
  .filter('eventeffectparser', function () {
    return function (input) {
      var effect = [];
      input.split(',').forEach(function(val){
        var pair = val.split(/(REL|REL_KAPITAN|MORALITY|GOLD|CARD)([+-=]\w+)/g)
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
        }else if(pair[0] === 'CARD'){
          effect.push({
            attr: 'card',
            value: pair[1].substring(1)
          });
        }
      });
      return effect;
    };
  })
  .filter('totaleffectparser', function(){
    return function(input){
      var total = {
        relationship: 0,
        morality: 0,
        gold: 0,
        cards: []
      };
      input.forEach(function(effects){
        effects.forEach(function(effect){
          if(effect.attr === 'relationship'){
            total.relationship += effect.value;
          }else if(effect.attr === 'morality'){
            total.morality += effect.value;
          }else if(effect.attr === 'gold'){
            total.gold += effect.value;
          }else if(effect.attr === 'card'){
            total.cards.push(effect.value);
          }
        });
      });
      return total;
    };
  })
  .filter('eventeffecttooltip', function($filter){
    return function(input){
      if(!input){
        return;
      }
      var effects = $filter('eventeffectparser')(input);
      var positives = [],
          negatives = [],
          status = [];
      var hasPositive = false;
      _.forEach(effects, function(val){
        if(val.attr === 'card'){
          status.push(' gain ' + val.value + ' status');
          return;
        }
        var qualifier = 'by a little';
        if(Math.abs(val.value) > 20){
          qualifier = 'by a lot';
        }
        if(val.value <= 0){
          negatives.push(val.attr + ' ' + qualifier);
        }else{
          hasPositive = true;
          positives.push(val.attr + ' ' + qualifier);
        }
      });

      var message = '';

      if(hasPositive){
        message += 'This will improve your ' + positives.join(', ') + '.';
      }

      if(negatives.length > 0){
        if(hasPositive){
          message += 'But you ';
        }else{
          message += 'You ';
        }
        message += 'will lose ' + negatives.join(', ') + '.';
      }

      if(status.length > 0){
        message += 'You will ' + status.join(', ') + '.';
      }

      var html = '<div class="campaign-manager"><img class="avatar-clickable small" src="assets/images/avatars/campaignmanager.png"></img><span>'+message+'</span>';

      return html;
    };
  });
