'use strict';

angular.module('partyanimalsDraftApp')
  .service('Ruleset', function Ruleset() {
    this.Restrictions = {
      isValidAction: function(restrictions, district){
        var isValid = true;
        if(restrictions){
          _.forEach(restrictions, function(restriction){
            if(restriction === 'DISTRICT-1' && district.id !== 1){
              isValid = false;
              return false;
            }else if(restriction === 'DISTRICT-4' && district.id !== 4){
              isValid = false;
              return false;
            }else if(restriction === -1){
              isValid = false;
              return false;
            }
          });
        }
        return isValid;
      }
    };

    this.calculateTravelCost = function(start, end){
      var cost = {
        gold: 300,
        hours: 1
      };

      var a = {
        x: start.id % 2,
        y: Math.floor(start.id / 2)
      };
      var b = {
        x: end.id % 2,
        y: Math.floor(end.id / 2)
      };
      var distance = Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2));
      if(distance === 2){
        cost.gold *= 2;
        cost.hours *= 2;
      }else if(distance !== 1){
        cost.gold = 500;
        cost.hours = 4;
      }

      if(cost.hours * end.timeCostModifier > 8){
        cost.hours = Math.floor(8 / end.timeCostModifier);
      }

      return cost.hours;
    };
  });
