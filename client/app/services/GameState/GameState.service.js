'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameState', function Gamestate($cookieStore) {
    var that = this;
    that.humanStats = {
      issueStats : null,
      hq: null
    };
    that.aiStats = {
      issueStats: null,
      hq: null
    };
    that.turnsLeft = 15;
    that.initialCash = 1000;

    that.eventsDb = [];

    that.districts = [];
    that.kapitans = [];
    that.issues = [];

    that.reputations = [];

    that.getEvent = function(kapitan){
      //search from list of kapitans
      var events = that.findEventByKapitanId(kapitan.id);
      return events[0];
    };

    that.findEventByKapitanId = function(kapitanId){
      return that.eventsDb.filter(function(val){
        return val.character === kapitanId;
      });
    };

    that.getDialog = function(index, event){
      console.log(event);
      return _.find(event.dialog,function(val){
        return val.id === index;
      });
    };

    that.getTotalReputation = function(){
      //compute votes
      //compute total population
      var totalPopulation = that.districts.reduce(function(a, district){
        return a + district.population;
      }, 0);
      var totalHuman = that.districts.reduce(function(a, district){
        return a + (district.population * (Math.min(district.humanReputation, 100) /100));
      }, 0);
      var totalAi = that.districts.reduce(function(a, district){
        return a + (district.population * (Math.min(district.aiReputation, 100)/100));
      }, 0);

      //get % of votes / total population
      console.log('Total Votes: ', totalHuman);
      that.reputations.push({
        turn: that.turnsLeft,
        human: {
          reputation: totalHuman/totalPopulation * 100,
          votes: totalHuman
        },
        ai: {
          reputation: totalAi/totalPopulation * 100,
          votes: totalAi
        }
      });
      return that.reputations;
    };

    that.updateTurn = function(turn){
      that.turnsLeft = turn;
    };

    that.updateGameState = function(human, ai, districts, kapitans, issues){
      that.humanStats = human;
      that.aiStats = ai;
      that.districts = districts;
      that.kapitans = kapitans;
      that.issues = issues;
    };


    that.setHuman = function(issueStats, hq){
      that.humanStats.issueStats = issueStats;
      that.humanStats.hq = hq;
      $cookieStore.put('humanStats', that.humanStats);
    };

    that.setAI = function(issueStats, hq){
      that.aiStats.issueStats = issueStats;
      that.aiStats.hq = hq;
      $cookieStore.put('aiStats', that.aiStats);
    };

    that.getHuman = function(){
      that.humanStats = $cookieStore.get('humanStats');
      return that.humanStats;
    };

    that.getAI = function(){
      that.aiStats = $cookieStore.get('aiStats');
      return that.aiStats;
    };

    that.getTurnsLeft = function(){
      return that.turnsLeft;
    };

    that.getInitialCash = function(){
      return that.initialCash;
    };

  });
