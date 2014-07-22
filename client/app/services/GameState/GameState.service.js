'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameState', function Gamestate($cookieStore, $filter) {
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
        console.log('Good Event: '+val.name, filter.MET, isRepeat);
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

    that.getDialog = function(index, event, district){
      console.log('MET:', that.humanStats.doneEvents);
      var conditions = {
        MET: that.humanStats.met[event.character],
        MORALITY: that.humanStats.morality,
        ISSUE: that.humanStats.issueStats,
        LREPUTATION: district.humanReputation
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
                                   .replace('LREPUTATION', conditions.LREPUTATION)
                                   .replace('ISSUE0', conditions.ISSUE[0].level));
        });
        if(selected){
          return that.getDialog(selected.next, event, district);
        }else{
          return that.getDialog(defaultCondition.next, event, district);
        }
      }
      return dialog;
    };

    that.getActivity = function(id, activities){
      return _.find(activities, function(val){
        return val.id === id;
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
      console.log('MET->GameState:', that.humanStats.doneEvents);
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

    that.findKapitan = function(id){
      console.log('Kapitans: ', that.kapitans);
      return _.find(that.kapitans, function(val){
        return val.id === id;
      });
    };

    that.getReputationActivityResult = function(activity, isAI){
      var attributeParser = $filter('attributeparser')(activity.effect.attr);
      var PKRm = $filter('feelingstorollmodifier')(activity.location.kapitan.humanRelations);
      var OKRm = $filter('feelingstorollmodifier')(activity.location.kapitan.aiRelations);
      if(isAI){
        PKRm = $filter('feelingstorollmodifier')(activity.location.kapitan.aiRelations);
        OKRm = $filter('feelingstorollmodifier')(activity.location.kapitan.humanRelations);
      }
      var dataForCheck = {
        random: Math.random() * 100,
        PKRm: PKRm,
        em: 10,
        OKRm: OKRm
      };
      var dataForActionDifficulty = {
        BD: activity.difficulty,
        em: 10,
        OKRm: OKRm
      };

      var actionCheck = $filter('formulaparser')(activity.actionCheck, dataForCheck);
      var actionDifficulty = $filter('formulaparser')(activity.actionDifficulty, dataForActionDifficulty);
      var success = false;
      if(actionCheck > actionDifficulty){
        success = true;
      }

      var resultValue = $filter('formulaparser')(activity.effect.modifier, {AR: Math.floor(actionCheck), AD: actionDifficulty});
      if(success && attributeParser.isVs){
        resultValue = resultValue * -1;
      }
      var result = {
        value: resultValue,
        success: success,
        type: 'REPUTATION',
        district: activity.location,
        name: activity.name,
        cost: activity.cost,
        isVs: attributeParser.isVs
      };

      return result;
    };


    that.calculateMovementCost = function(start, end){
      var cost = {
        gold: 300,
        hours: 3
      };

      var a = {
        x: start.id % 2,
        y: Math.floor(start.id / 2)
      };
      var b = {
        x: end.id % 2,
        y: Math.floor(end.id / 2)
      };
      var distance = Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2));
      if(distance === 2){
        cost.gold *= 2;
        cost.hours *= 2;
      }else if(distance !== 1){
        cost.gold = 500;
        cost.hours = 4;
      }

      return cost;
    };

    that.generateMoveActivity = function(start, dest){
      var moveActivity = {
        id: -1,
        type: 'MOVE',
        name: 'Move Here',
        text: {
          success: ['Moved to $place$'],
          fail: ['Failed to move to $place$']
        },
        cost: {
          gold: 100,
          hours: 3
        },
        disabled: false,
        location: angular.copy(dest)
      };
      moveActivity.cost = that.calculateMovementCost(start, dest);
      return moveActivity;
    };

    that.getRandomNumberExcept = function(except, max){
      var index = Math.floor(Math.random()*max);
      if(index === except){
        return that.getRandomNumberExcept(except, max);
      }else{
        return index;
      }
    };
  });
