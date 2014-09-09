'use strict';

angular.module('partyanimalsDraftApp')
  .service('Aisim', function Aisim(GameState) {
    var that = this;
    var BRIBE = 5;
    //generate ai affinities (which kapitans, he likes)
    that.moralAffinity = Math.floor(80);//Math.random()*100);
    //generate good/evil affinity (the likelihood to do morality)
    //generate appetite for greed (the likelihood for money making)
    that.ai = null;
    that.scheduledActivities = [];

    var getRandomDistrict = function(districts){
      // var currId = GameState.getRandomNumberExcept(that.ai.currentLocation.id, GameState.districts.length);
      var currId = Math.floor(Math.random() * districts.length);
      var district = districts[currId];
      if(!district.kapitan){
        district.kapitan = GameState.findKapitan(district.kapitanId);
      }
      return district;
    };

    var selectActivity = function(id, activities){
      return _.find(activities, function(act){
        return act.id === id;
      });
    };

    that.proposeAction = function(districts, activities){
      //examine the landscape and do a move
      var actions = [];
      //select district with lowest rating
      var district = angular.copy(getRandomDistrict(districts));
      _.forEach(that.ai.staff, function(staff){

        if(!staff.activity){
          //something should be up here
          var confdActivity = angular.copy(selectActivity(BRIBE, activities));

          confdActivity.details = {};
          confdActivity.details.hoursPassed = 0;
          confdActivity.details.hours = confdActivity.cost.hours;
          confdActivity.details.actor = staff;
          confdActivity.details.cost = confdActivity.cost.gold;
          confdActivity.district = district;

          actions.push(confdActivity);
        }
      });


      return actions;
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
