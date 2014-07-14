'use strict';

angular.module('partyanimalsDraftApp')
  .filter('formulaparser', function () {
    return function (input, values) {
      if(!values){
        return parseInt(input);
      }
      var parsed = input.replace('random',values.random)
                        .replace('PKRm', values.PKRm)
                        .replace('OKRm', values.OKRm)
                        .replace('AR', values.AR)
                        .replace('AD', values.AD)
                        .replace('BD', values.BD)
                        .replace('ITL', values.ITL)
                        .replace('IDM', values.IDM)
                        .replace('em', values.em);
      var val = eval(parsed);
      return val;
    };
  })
  .filter('attributeparser', function(){
    return function(input){
      if(input.charAt(0) === 'O'){
        return {
          value: input,
          isVs: true
        };
      }else{
        return {
          value: input,
          isVs: false
        };
      }
    };
  });