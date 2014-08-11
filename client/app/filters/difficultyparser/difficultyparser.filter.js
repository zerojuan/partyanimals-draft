'use strict';

angular.module('partyanimalsDraftApp')
  .filter('difficultyparser', function () {
    return function (actionCheck, actionDifficulty) {
      var difference = actionCheck - actionDifficulty;
      if(difference > 30){
        return 'VERY EASY';
      }else if(difference <= 30 && difference > 10){
        return 'EASY';
      }else if(difference <= 10 && difference > -10){
        return 'NORMAL';
      }else{
        return 'HARD';
      }
    };
  })
  .filter('difficultytooltip', function($filter){
    return function(input){
      var str = '';

      var spanClass = '';
      var pkrm = input.PKRm;
      if(input.PKRm === 0){
        spanClass = 'gray';
        pkrm = '0';
      }else if(input.PKRm > 0){
        spanClass = 'green';
        pkrm = '+'+input.PKRm;
      }else{
        spanClass = 'red';
        pkrm = ''+input.PKRm;
      }
      str += '<div><p>Kapitan <span class=\"'+spanClass+'\">('+pkrm+') ' +input.humanFeelings+ ' You </span></p>';
      var okrm = -1 * input.OKRm;
      if(input.OKRm === 0){
        spanClass = 'gray';
        okrm = '0';
      }else if(input.OKRm > 0){
        spanClass = 'green';
        okrm = '+'+input.PKRm;
      }else{
        spanClass = 'red';
        okrm = ''+input.PKRm;
      }
      str += '<p>Kapitan <span class=\"'+spanClass+'\">('+okrm+') ' +input.aiFeelings+ ' Catorcio </span></p>';

      if(input.IDS > 2){
        spanClass = 'red';
      }else{
        spanClass = 'green';
      }
      str += '<p>Platform Strength: <span class="'+spanClass+'"> Lvl. '+input.IDS+'</span></p>';
      str += '<p>Issue Demand: <span class="'+$filter('demandparser')(input.IDM)+'">'+$filter('demandparser')(input.IDM)+'</span></p></div>';

      return str;
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
  })
  .filter('demandexplainer', function(){
    return function(input){
      if(input < 30){
        return 'Locals care for this issue a lot. They respond well to candidates with a developed platform on this issue';
      }else if(input < 45){
        return 'Locals don\'t particularly care for this issue but they\'ll still appreciate your platform';
      }else{
        return 'Locals don\'t care for this issue.';
      }
    };
  });
