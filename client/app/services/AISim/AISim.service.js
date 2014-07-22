'use strict';

angular.module('partyanimalsDraftApp')
  .service('Aisim', function Aisim(GameState) {
    var that = this;

    //generate ai affinities (which kapitans, he likes)
    that.moralAffinity = 30; //Math.floor(Math.random()*100);
    //generate good/evil affinity (the likelihood to do morality)
    //generate appetite for greed (the likelihood for money making)
    that.ai = null;
    that.scheduledActivities = [];

    var getRandomDistrict = function(){
      var currId = GameState.getRandomNumberExcept(that.ai.currentLocation.id, GameState.districts.length);
      return GameState.districts[currId];
    };


    var markedHours = 0;
    var activeIndex = 0;
    that.generateActivities = function(activities, humanSchedule){
      console.log('Generating activities');
      console.log('AI:', that.ai);
      console.log('Human Schedule: ', humanSchedule);
      that.ai = GameState.aiStats;
      that.scheduledActivities = [];
      var act = null;
      //go to random district
      var district = getRandomDistrict();

      console.log('Going to district: ', district.name);
      that.scheduledActivities.push(GameState.generateMoveActivity(that.ai.currentLocation, district));
      //do i have loose morals?
      if(that.moralAffinity <= 50){
        //bribe the shit out of it
        act = GameState.getActivity(5, activities);
        act.location = angular.copy(district);
        act.location.kapitan = GameState.findKapitan(act.location.kapitanId);
        console.log('Activity:::', act);
        that.scheduledActivities.push(act);
      }else{
        //does the kapitan like me?
        // console.log('District:',district);
        // if(district.kapitan.aiRelations > 50){
          //photo op!
          act = GameState.getActivity(2, activities);
          act.location = angular.copy(district);
          that.scheduledActivities.push(act);
        // }else{
        //   //make kapitan like me
        // }
      }
      markedHours = 0;
      activeIndex = 0;
      return that.scheduledActivities;
    };


    that.simulateActivities = function(hour, ignoreTime){
      //should return a result
      console.log('Time elapsed: ', hour);
      var activeActivity = that.scheduledActivities[activeIndex];
      if(ignoreTime){
        activeIndex++;
        return that.getResultFromActivity(activeActivity);
      }

      if(markedHours + activeActivity.cost.hours <= hour){
        activeIndex++;
        markedHours = markedHours + activeActivity.cost.hours;
        console.log('Done with: ', activeActivity.name);
        return that.getResultFromActivity(activeActivity);
      }
    };

    that.getPendingMovesCount = function(){
      return that.scheduledActivities.length - activeIndex;
    };

    that.getResultFromActivity = function(activity){
      if(activity.type === 'MOVE'){
        return {
          type: 'MOVE',
          district: activity.location
        };
      }else if(activity.type === 'REPUTATION'){
        return GameState.getReputationActivityResult(activity, true);
      }
    };
  });
