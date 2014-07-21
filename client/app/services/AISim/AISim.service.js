'use strict';

angular.module('partyanimalsDraftApp')
  .service('Aisim', function Aisim(GameState) {
    var that = this;

    //generate ai affinities (which kapitans, he likes)
    that.moralAffinity = Math.floor(Math.random()*100);
    //generate good/evil affinity (the likelihood to do morality)
    //generate appetite for greed (the likelihood for money making)
    that.ai = null;
    that.scheduledActivities = [];

    var getRandomDistrict = function(){
      var currId = GameState.getRandomNumberExcept(that.ai.currentLocation.id, GameState.districts.length);
      return GameState.districts[currId];
    };

    that.generateActivities = function(activities, humanSchedule){
      console.log('Generating activities');
      console.log('AI:', that.ai);
      console.log('Human Schedule: ', humanSchedule);
      that.ai = GameState.aiStats;
      that.scheduledActivities = [];
      //go to random district
      var district = getRandomDistrict();
      console.log('Going to district: ', district.name);
      that.scheduledActivities.push(GameState.generateMoveActivity(that.ai.currentLocation, district));
      //do i have loose morals?
      if(that.moralAffinity <= 50){
        //bribe the shit out of it
      }else{
        //does the kapitan like me?
          //photo op!
        //else
          //make kapitan like me
      }

    };

    that.simulateActivities = function(hour){
      console.log('Simulate activities');
    };
  });
