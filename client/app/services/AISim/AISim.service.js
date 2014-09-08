'use strict';

angular.module('partyanimalsDraftApp')
  .service('Aisim', function Aisim(GameState) {
    var that = this;

    //generate ai affinities (which kapitans, he likes)
    that.moralAffinity = Math.floor(80);//Math.random()*100);
    //generate good/evil affinity (the likelihood to do morality)
    //generate appetite for greed (the likelihood for money making)
    that.ai = null;
    that.scheduledActivities = [];



    that.generateMove = function(districts, activities){
      //send all available minions out
      //bribe to random place
    };

    that.getResultFromActivity = function(activity){
      if(activity.type === 'MOVE'){
        return {
          type: 'MOVE',
          district: activity.location,
          cost: activity.cost
        };
      }else if(activity.type === 'REPUTATION'){
        return GameState.getReputationActivityResult(activity, true);
      }else if(activity.type === 'STAT'){
        console.log('STAT??????');
        return GameState.getStatActivityResult(activity, true);
      }else if(activity.type === 'TALK'){
        return GameState.getAITalkResult(activity, true);
      }
    };
  });
