'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameState', function Gamestate($cookieStore, $filter) {
    var that = this;
    that.humanStats = {
      name: 'Mousey',
      issueStats : null,
      hq: null
    };
    that.aiStats = {
      name: 'Crocopio',
      issueStats: null,
      hq: null
    };
    that.turnsLeft = 15;
    that.initialCash = 1000;

    that.eventsDb = [];

    that.districts = [];
    that.kapitans = [];
    that.issues = [];
    that.cards = [];

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
      var latestReputation = that.reputations[that.reputations.length - 1];
      var conditions = {
        GOLD: that.humanStats.totalCash,
        MET: that.humanStats.met[event.character],
        MORALITY: that.humanStats.morality,
        ISSUE: that.humanStats.issueStats,
        LREPUTATION: district.humanReputation,
        GREPUTATION: latestReputation.human.reputation,
        OGREPUTATION: latestReputation.ai.reputation,
        REL: district.kapitan.humanRelations
      };
      var dialog =  _.find(event.dialog,function(val){
        return val.id === index;
      });
      if(dialog.conditions){
        console.log('Conditions: ', dialog.conditions);
        var defaultCondition = null;
        var selected = _.find(dialog.conditions, function(val){
          console.log('Testing: ' + val.condition);
          if(val.condition === 'DEFAULT') {
            defaultCondition = val;
            return false;
          }
          if(that.isCardCondition(val.condition)){
            console.log('This is a card condition');
            return that.evalCardCondition(val.condition);
          }
          console.log('Kapitan Relations: ', that.kapitans);
          return eval(val.condition.replace('MORALITY',conditions.MORALITY)
                                   .replace('GREPUTATION', conditions.GREPUTATION)
                                   .replace('OGREPUTATION', conditions.OGREPUTATION)
                                   .replace('LREPUTATION', conditions.LREPUTATION)
                                   .replace('REL0', that.findKapitan(0).humanRelations)
                                   .replace('REL1', that.findKapitan(1).humanRelations)
                                   .replace('REL2', that.findKapitan(2).humanRelations)
                                   .replace('REL3', that.findKapitan(3).humanRelations)
                                   .replace('REL4', that.findKapitan(4).humanRelations)
                                   .replace('REL5', that.findKapitan(5).humanRelations)
                                   .replace('REL', conditions.REL)
                                   .replace('GOLD', conditions.GOLD)
                                   .replace('ISSUE0', conditions.ISSUE[0].level)
                                   .replace('ISSUE1', conditions.ISSUE[1].level)
                                   .replace('ISSUE2', conditions.ISSUE[2].level));
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

    that.resetReputations = function(){
      that.reputations = [];
      return that.reputations;
    };

    that.updateDistrictReputationHistory = function(districts){
      _.forEach(districts, function(district){
        district.humanReputations.push(district.humanReputation);
        district.aiReputations.push(district.aiReputation);
      });
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
      that.humanStats.image = 'mouseyMale.jpg';
      $cookieStore.put('humanStats', that.humanStats);
    };

    that.setAI = function(issueStats, hq, personality){
      that.aiStats.issueStats = issueStats;
      that.aiStats.personality = personality;
      that.aiStats.hq = hq;
      that.aiStats.image = 'crocopio.jpg';
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

    that.findTrait = function(id, traits){
      return _.find(traits, function(val){
        return val.id === id;
      });
    };

    that.findKapitan = function(id){
      console.log('Kapitans: ', that.kapitans);
      return _.find(that.kapitans, function(val){
        return val.id === id;
      });
    };

    that.findDistrict = function(id, districts){
      return _.find(districts, function(val){
        return val.id === id;
      });
    };

    that.isCardCondition = function(val){
      var cond = val.split(/(CARD\?)(\w+)/g)
                .filter(function(v){
                  return v !== '';
                });
      return cond[0] === 'CARD?';
    };

    that.setTyphoonDistricts = function(activities, districts){
      var disasterZones = [
        [0,1,3],
        [1,3,5],
        [3,4,5],
        [2,4,5],
        [0,2,4]
      ];
      var disasterZone = disasterZones[Math.floor(Math.random()*5)];
      //set activities with id 9
      var reliefActivity = _.find(activities, function(val){
        return val.id === 10;
      });
      reliefActivity.restriction = disasterZone;
      _.forEach(districts, function(val){
        console.log('DisasterZone: ', disasterZone, 'ID: ', val.id);
        for(var i = 0; i < disasterZone.length; i++){
          if(disasterZone[i] === val.id){
            console.log('Found');
            val.isHurricane = true;
          }
        }
      });
    };

    that.unsetTyphoonDistricts = function(activities, districts){
      _.forEach(districts, function(val){
         val.isHurricane = false;
      });
      var reliefActivity = _.find(activities, function(val){
        return val.id === 10;
      });
      reliefActivity.restriction = [-1];
    };

    that.activateCards = function(cardIds){
      _.forEach(cardIds, function(cardId){
        that.activateCard(cardId);
      });
      return that.cards;
    };

    that.activateCard = function(cardId){
      _.forEach(that.cards, function(card){
        if(card.id === cardId){
          card.active = true;
          card.applied = false;
        }
      });
    };

    that.getCard = function(cardId){
      return _.find(that.cards, function(card){
        return card.id === cardId;
      });
    };

    that.evalCardCondition = function(val){
      var cond = val.split(/(CARD\?)(\w+)/g)
                .filter(function(v){
                  return v !== '';
                });
      if(cond[0] === 'CARD?'){
        var card = that.findCard(cond[1]);
        var isActive = false;
        if(card && (card.done || card.turns > 0)){
          isActive = true;
        }
        console.log('This card: ' + cond[1] + ' is ' + isActive);
        return eval(isActive+cond[2]);
      }
      return false;
    };

    that.findCard = function(id){
      return _.find(that.cards, function(val){
        return val.id === id;
      });
    };

    that.getStatActivityResult = function(activity){
      console.log('ISSUE STATS: ', that.aiStats, activity.location.aiStance);
      var issueIndex = _.findIndex(that.aiStats.issueStats, function(issue, i){
        if(activity.location.aiStance[i] < issue.level){
          return true;
        }
        return false;
      });
      if(issueIndex < 0){
        return {
          name: activity.name,
          type: 'STAT',
          success: false,
          district: activity.location,
          cost: {
            gold: 0
          }
        };
      }
      return {
        type: 'STAT',
        name: activity.name,
        success: true,
        issueIndex: issueIndex,
        value: 1,
        cost: {
          gold: 0
        },
        district: activity.location
      };
    };

    that.getAITalkResult = function(activity){
      return {
        success: true,
        cost: {
          gold: 0
        },
        type: 'TALK',
        value: 30,
        district: activity.location
      };
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
        type: activity.type,
        district: activity.location,
        name: activity.name,
        cost: activity.cost,
        isVs: attributeParser.isVs,
        attribute: attributeParser.value
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

      if(cost.hours * end.timeCostModifier > 8){
        cost.hours = Math.floor(8 / end.timeCostModifier);
      }

      return cost;
    };

    that.generateMoveActivity = function(start, dest){
      var moveActivity = {
        id: -1,
        type: 'MOVE',
        name: 'Move Here',
        description: 'Travel',
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

    that.projectVote = function(population, reputation){
      var vote = (population*0.8) * reputation / 100;
      if(vote === 0){
        vote = Math.random() * 20;
      }
      return Math.floor(vote);
    };

    that.capFeelings = function(newFeelings){
      if(newFeelings < 0){
        return 0;
      }else if(newFeelings > 100){
        return 100;
      }
      return newFeelings;
    };

    that.capReputation = function(a, b, add){
      var diff = 100 - (a+add + b);
      if(diff < 0){
          b += diff;
      }
      if(a+add > 100){
          add = 100 - a;
          b = 0;
      }
      return {
          b: b,
          a: a+add
      };
    };
  });
