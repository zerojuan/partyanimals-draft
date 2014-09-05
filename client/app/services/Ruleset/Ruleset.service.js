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
  });
