'use strict';

angular.module('partyanimalsDraftApp')
  .service('Aisim', function Aisim(GameState) {
    var that = this;
    var BRIBE = 5;
    var CONTEST = 4;
    var EDUCATE = 6;
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

    that.proposeAction = function(ai, districts, activities){
      //examine the landscape and do a move
      var actions = [];
      var district;
      //select district with lowest rating??

      _.forEach(ai.staff, function(staff){
        district = angular.copy(getRandomDistrict(districts));
        if(!staff.activity){
          //something should be up here
          if(Math.random()*100 > 50){
            var confdActivity;
            if(Math.random()*100 > 50){
              confdActivity = angular.copy(selectActivity(BRIBE, activities));
              confdActivity.details = {};

            }else{
              if(Math.random()*100 > 50){
                confdActivity = angular.copy(selectActivity(CONTEST, activities));
                confdActivity.details = {};
                confdActivity.details.selectedIssue = 0;
                confdActivity.details.isVs = true;
              }else{
                confdActivity = angular.copy(selectActivity(EDUCATE, activities));
                confdActivity.details = {};
                confdActivity.details.selectedIssue = 0;
                confdActivity.details.isVs = false;
              }

            }

            confdActivity.details.daysPassed = 0;
            confdActivity.details.days = confdActivity.cost.days;
            confdActivity.details.actor = staff;
            confdActivity.details.cost = confdActivity.cost.gold;
            confdActivity.district = district;




            actions.push(confdActivity);
          }

        }
      });

      if(!ai.activity){
        console.log('AI has no activity?', ai.activity);
        district = angular.copy(getRandomDistrict(districts));
        var aiActivity = angular.copy(selectActivity(BRIBE, activities));

        aiActivity.details = {};
        aiActivity.details.daysPassed = 0;
        aiActivity.details.days = aiActivity.cost.days;
        aiActivity.details.actor = ai;
        aiActivity.details.cost = aiActivity.cost.gold;
        aiActivity.district = district;

        actions.push(aiActivity);
      }

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
