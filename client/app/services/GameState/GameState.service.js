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

    var combineName = function(name){
      return name.split(' ').join('');
    };

    that.getEvent = function(kapitan){
      //search from list of kapitans
      var events = that.findEventByKapitanId(kapitan.id);
      //get events that satisfy conditions
      var conditions = {
        MET: that.humanStats.met[kapitan.id],
        MORALITY: that.humanStats.morality
      };
      var event = that.findEventByFilter(conditions, events);
      //mark this event as done
      var stringId = combineName(event.name);
      if(!that.humanStats.doneEvents[stringId]){
        that.humanStats.doneEvents[stringId] = 0;
      }
      that.humanStats.doneEvents[stringId] += 1;
      return event;
    };

    that.findEventByFilter = function(filter, events){
      var event = _.find(events, function(val){
        if(val.condition === 'DEFAULT'){
          return false;
        }
        var isRepeat = that.humanStats.doneEvents[combineName(val.name)] > 0;
        var res = eval(val.condition.replace('MET',filter.MET));
        return !isRepeat && res;
      });
      if(event){
        return event;
      }else{
        //get the default event
        event = _.find(events, function(val){
          return val.condition === 'DEFAULT';
        });
        return event;
      }
    };

    that.findEventByKapitanId = function(kapitanId){
      return that.eventsDb.filter(function(val){
        return val.character === kapitanId;
      });
    };

    that.getDialog = function(index, event){
      var conditions = {
        MET: that.humanStats.met[event.character],
        MORALITY: that.humanStats.morality,
        ISSUE: that.humanStats.issueStats
      };
      var dialog =  _.find(event.dialog,function(val){
        return val.id === index;
      });
      if(dialog.conditions){
        console.log('Conditions: ', dialog.conditions);
        var defaultCondition = null;
        var selected = _.find(dialog.conditions, function(val){
          if(val.condition === 'DEFAULT') {
            defaultCondition = val;
            return false;
          }
          return eval(val.condition.replace('MORALITY',conditions.MORALITY)
                                   .replace('ISSUE0', conditions.ISSUE[0].level));
        });
        if(selected){
          return that.getDialog(selected.next, event);
        }else{
          return that.getDialog(defaultCondition.next, event);
        }
      }
      return dialog;
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
