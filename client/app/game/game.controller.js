'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $rootScope, $http, PAFirebase, GameState, Aisim) {

    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;
    $scope.hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    $scope.hoursElapsed = 0;
    $scope.scheduledActivities = [];
    $scope.futureLocation = $scope.human.hq;
    $scope.currentLocation = $scope.human.hq;
    $scope.totalCost = 0;
    $scope.simulate = {
      simulateText: 'Start',
      isNextReady: false
    };
    $scope.config = {
      alerts: [],
      state: 'home'
    };
    $scope.currentPlayer = $scope.human;

    $scope.human.met = [0,0,0,0,0,0,0,0,0];
    $scope.human.totalCash = $scope.totalCash;
    $scope.human.morality = 50;
    $scope.human.doneEvents = [];

    $rootScope.$on('$stateChangeSuccess',
      function(){
        console.log('Successfully changed state');
      PAFirebase.removeCallbacks();
      addDataCallbacks();
    });

    var changedList = {};
    var onDataChanged = function(name){
      if(changedList[name] !== undefined){
        $scope.config.alerts.push({msg: 'Someone tweaked ' + name + '.', type: 'warning'});
        $scope.$apply();
        return true;
      }else{
        changedList[name] = true;
        return false;
      }
    };

    var addDataCallbacks = function(){
      PAFirebase.workhoursRef.on('value', function(snapshot){
        console.log('Loading data....');
        onDataChanged('workhours');
        var hours = snapshot.val();
        $scope.hours = [];
        for(var i = 0; i < hours; i++){
          $scope.hours.push(9+i);
        }
        $scope.$apply();
      });

      PAFirebase.cardsRef.on('value', function(snapshot){
        onDataChanged('cards');
        $scope.cards = snapshot.val();
        _.forEach($scope.cards, function(val){
          val.done = false;
          val.turns = -1;
          val.active = false;
        });
        GameState.cards = $scope.cards;
        $scope.$apply();
      });

      PAFirebase.goldRef.on('value', function(snapshot){
        if(!onDataChanged('initialGold')){
          $scope.totalCash = snapshot.val();
          $scope.human.totalCash = snapshot.val();
          $scope.ai.totalCash = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.turnsPerGameRef.on('value', function(snapshot){
        if(!onDataChanged('turnsPerGame')){
          $scope.turnsLeft = snapshot.val();
          // $scope.turnsLeft = 1;
          $scope.$apply();
        }
      });

      PAFirebase.districtsRef.on('value', function(snapshot){
        console.log('Districts');
        if(!onDataChanged('districts')){
          $scope.districts = snapshot.val();
          var selectedDistrict = null;
          $scope.districts.forEach(function(val){
            var i = 0;
            val.humanReputation = 0;
            val.aiReputation = 0;
            val.humanStance = [0,0,0,0,0];
            val.aiStance = [0,0,0,0,0];
            if(val.id === $scope.human.hq.id){
              val.isHQ = true;
              val.humanReputation = 50;
              val.hasHuman = true;
              for(i = 0; i < 5; i++){
                val.humanStance[i] = $scope.human.issueStats[i].level;
              }
              selectedDistrict = val;
            }
            if(val.id === $scope.ai.hq.id){
              val.isAIHQ = true;
              val.hasAI = true;
              val.aiReputation = 50;
              for(i = 0; i < 5; i++){
                val.aiStance[i] = $scope.ai.issueStats[i].level;
              }
              $scope.ai.hq = val;
              $scope.ai.currentLocation = val;
            }
          });
          _.forEach($scope.human.issueStats, function(val){
            if(val.level < 5){
              val.level += 1;
            }
          });
          _.forEach($scope.ai.issueStats, function(val){
            if(val.level < 5){
              val.level += 1;
            }
          });
          GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);

          //tally district approval ratings
          $scope.totalReputations = GameState.getTotalReputation();
          $scope.changeSelectedDistrict(findDistrict(selectedDistrict.id));
          $scope.$apply();

        }
      });

      PAFirebase.issuesRef.on('value', function(snapshot){
        if(!onDataChanged('issues')){
          $scope.issues = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.kapitansRef.on('value', function(snapshot){
        console.log('Kapitans');
        if(!onDataChanged('kapitans')){
          $scope.kapitans = snapshot.val();
          angular.forEach($scope.kapitans, function(val){
            val.humanRelations = 50;
            val.aiRelations = 50;
          });
          GameState.kapitans = $scope.kapitans;
          $scope.$apply();
        }
      });

      PAFirebase.eventsRef.on('value', function(snapshot){
        if(!onDataChanged('events')){
          $scope.eventsDb = snapshot.val();
          GameState.eventsDb = $scope.eventsDb;
        }
      });

      PAFirebase.activitiesRef.on('value', function(snapshot){
        if(!onDataChanged('activities')){
          $scope.activities = snapshot.val();
          $scope.changeSelectedDistrict(findDistrict($scope.human.hq.id));
          $scope.$apply();

        }
      });
    };

    addDataCallbacks();


    $scope.addToItinerary = function(activity){
      $scope.showItinerary = true;
      if(activity.type === 'MOVE'){
        //change current location
        $scope.futureLocation = activity.location;
      }
      if(activity.wasScheduled){ //remove schedule
        activity.wasScheduled = false;
        //remove from array
        removeFromSchedule(activity);
        if(activity.type === 'MOVE'){
          $scope.selectedDistrict.activities.forEach(function(val){
            if(val.type !== 'MOVE'){val.disabled = true;}
          });
        }
      }else{ //add schedule
        activity.wasScheduled = true;
        $scope.scheduledActivities.push(activity);
        if(activity.type === 'MOVE'){
          $scope.selectedDistrict.activities.forEach(function(val){
            if(val.type !== 'MOVE'){val.disabled = false;}
          });
        }
      }
    };

    $scope.changeSelectedDistrict = function(district){
      if($scope.selectedDistrict){
        $scope.selectedDistrict.selected = false;
      }
      console.log('Changing selected district');
      $scope.selectedDistrict = district;
      $scope.selectedDistrict.selected = true;
      generateActivities();
    };

    var generateActivities = function(){
      console.log('Generate activitieis?');
      $scope.selectedDistrict.kapitan = $scope.findKapitan($scope.selectedDistrict.kapitanId);
      if(!$scope.selectedDistrict.kapitan) return;
      $scope.selectedDistrict.activities = [];
      if($scope.selectedDistrict.specialistId){
        $scope.selectedDistrict.specialist = $scope.findKapitan($scope.selectedDistrict.specialistId);
      }
      //load activities for this item
      var moveActivity, inFutureLocation = null;
      inFutureLocation = $scope.futureLocation.id === $scope.selectedDistrict.id;

      var tooltipVals = {
        BD: 0,
        PKRm: $scope.selectedDistrict.kapitan.humanRelations,
        OKRm: $scope.selectedDistrict.kapitan.aiRelations
      };

      moveActivity = GameState.generateMoveActivity($scope.futureLocation, $scope.selectedDistrict);
      moveActivity.tooltipVals = angular.copy(tooltipVals);

      if(isInSchedule(moveActivity)){
        moveActivity.wasScheduled = true;
      }

      toggleDisable(moveActivity, shouldDisable);

      var activities = [];

      $scope.activities.forEach(function(val){
        var newVal = angular.copy(val);
        if(val.restriction && _.indexOf(val.restriction, $scope.selectedDistrict.id) < 0){
          return;
        }
        newVal.location = angular.copy($scope.selectedDistrict);
        //check if this is already selected
        if(isInSchedule(newVal)){
          newVal.wasScheduled = true;
        }

        //pkrm and stuff
        newVal.tooltipVals = angular.copy(tooltipVals);
        newVal.tooltipVals.BD = val.difficulty;
        //check if we are in the future location
        toggleDisable(newVal, shouldDisable);

        activities.push(newVal);
      });

      if(moveActivity){
        activities.unshift(moveActivity);
      }

      $scope.selectedDistrict.activities = activities;
    };

    var actIndex = 0;
    $scope.onItineraryGo = function(){
      //execute the itinerary
      $scope.simulate.simulateText = 'Start';
      $scope.simulate.summaries = [];
      $scope.simulate.aiSummaries = [];
      $scope.simulate.isNextReady = true;
      $scope.simulate.miscFunds = 0;
      $scope.showOverlay = true;
      $scope.endTurn = false;
      $scope.hoursElapsed = 0;
      actIndex = 0;
      GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);
    };


    $scope.simulate.onNext = function(){
      //is turn done?
      if(actIndex > $scope.scheduledActivities.length-1){
        wrapTurn();
        //TODO: ask if there are still activities pending in the AI
        var pendingMoves = Aisim.getPendingMovesCount();
        while(pendingMoves > 0){
          console.log('Pending Moves:', pendingMoves);
          var aiResult = Aisim.simulateActivities($scope.hoursElapsed, true);
          processAIMove(aiResult);
          pendingMoves = Aisim.getPendingMovesCount();
        }

        return;
      }
      $scope.simulate.simulateText = 'Next';
      $scope.simulate.isNextReady = false;
      $scope.simulate.activeAct = $scope.scheduledActivities[actIndex];
      actIndex++;
    };

    $scope.simulate.onNextReady = function(result){
      var changedDistrict;
      var message = '';
      if(result){
        var cost = (result.cost.gold * result.district.goldCostModifier) * -1;
        var moralityCost = result.cost.morality ? result.cost.morality : 0;
        if(result.type === 'STAT'){
          if(result.success){
            changedDistrict = setStatForDistrict(result.issueIndex, result.district, result.value, result.value > 0);
            //update district data of the listed activities
            if($scope.scheduledActivities.length < actIndex){
              $scope.scheduledActivities[actIndex].location = angular.copy(changedDistrict);
            }
          }

          if(result.issueIndex < 0){
            message = result.name + ' at ' + result.district.name + ' failed due to lack of direction.';
          }else{
            message = result.name + ' ' + $scope.issues[result.issueIndex].name + ' at ' + result.district.name;
          }

          $scope.simulate.summaries.push({
            text: message,
            cost: cost,
            success: result.success
          });
        }else if(result.type === 'REPUTATION'){
          if(result.success){
            changedDistrict = setReputationForDistrict(result.value, result.district, !result.isVs);
            if($scope.scheduledActivities.length < actIndex){
              $scope.scheduledActivities[actIndex].location = angular.copy(changedDistrict);
            }
            message = result.name + ' at ' + result.district.name + ' resulting to a ' + result.value + ' ' +
               (result.isVs ? ' decrease to opponent\'s reputation' : ' increase on our reputation.');
          }else{
            message = result.name + ' at ' + result.district.name + ' failed.';
          }

          $scope.simulate.summaries.push({
            text: message,
            cost: cost,
            success: result.success
          });
        }else if(result.type === 'SORTIE'){
          changedDistrict = setReputationForDistrict(result.value, result.district, true);
          if($scope.scheduledActivities.length < actIndex){
            $scope.scheduledActivities[actIndex].location = angular.copy(changedDistrict);
          }

          $scope.simulate.summaries.push({
            text: result.name + ' at ' + result.district.name + ' increased reputation by ' + result.value +
              '. They responded well to ' + result.stats.best,
            cost: cost,
            success: result.success
          });
        }else if(result.type === 'TALK'){
          //TODO: get the real stat for the kapitan
          var kapitan = result.kapitan;
          var total = result.total;
          var localKapitan = $scope.findKapitan(kapitan.id);
          localKapitan.humanRelations += total.relationship;
          if(localKapitan.type === 'KAPITAN'){
            changedDistrict = setKapitanForDistrict(localKapitan, result.district);
          }
          if($scope.scheduledActivities.length < actIndex){
            $scope.scheduledActivities[actIndex].location = angular.copy(changedDistrict);
          }

          if(result.willRepeat){
            $scope.human.doneEvents[result.name] = 0;
          }else{
            //if an event is unfinished and will happen again, then you haven't really met
            $scope.human.met[kapitan.id] += 1;
          }
          if(total.cards && total.cards.length > 0){
            $scope.cards = GameState.activateCards(total.cards);
            //apply cards
            _.forEach($scope.cards, function(card){
              if(card.active && !card.applied){
                if(card.id === 'BookDeal'){
                  _.forEach($scope.districts, function(district){
                    if(district.humanStance[0] < 5){
                      district.humanStance[0] += 1;
                    }
                  });
                  card.applied = true;
                }
              }
            });
            GameState.cards = $scope.cards;
          }
          $scope.totalCash += result.total.gold;
          $scope.simulate.miscFunds += result.total.gold;
          $scope.human.morality += result.total.morality;
          $scope.simulate.summaries.push({
            text: 'Talked with the Kapitan ('+total.relationship+' Relationship)',
            success: true,
            cost: cost
          });
        }else if(result.type === 'MOVE'){
          $scope.simulate.summaries.push({
            text: 'Travelled to ' + result.district.name,
            success: result.success,
            cost: cost
          });
        }else if(result.type === 'SPECIAL'){
          message = '';
          if(result.attribute === 'MORALITY'){
            message = 'Confession improved our morality';
            $scope.human.morality += result.value;
          }else if(result.attribute === 'GOLD'){
            if(result.success){
              message = 'Won a $'+result.value+'at the Casino';
              $scope.simulate.miscFunds += result.value;
              $scope.totalCash += result.value;
            }else{
              message = 'Lost at the Casino.';
            }
          }
          $scope.simulate.summaries.push({
            text: message,
            success: result.success,
            cost: cost
          });
        }
        $scope.human.morality += moralityCost;
      }
      //TODO: simulate enemy turn based on time elapsed
      $scope.hoursElapsed += result.hours;
      var aiResult = Aisim.simulateActivities($scope.hoursElapsed);
      processAIMove(aiResult);
      $scope.simulate.isNextReady = true;
    };

    $scope.simulate.onEndTurn = function(){
      //ui reset
      $scope.showItinerary = false;
      $scope.showOverlay = false;
      $scope.endTurn = false;

      //advance game state
      $scope.totalCash = $scope.totalCash - $scope.totalCost + $scope.totalContribution;
      $scope.human.totalCash = $scope.totalCash;
      $scope.turnsLeft -= 1;
      $scope.scheduledActivities = [];
      $scope.currentLocation = $scope.futureLocation;

      $scope.selectedDistrict.selected = false;
      $scope.selectedDistrict = null;
      $scope.changeSelectedDistrict(findDistrict($scope.currentLocation.id));
      // $scope.selectedDistrict.selected = true;
      movePlayerToLocation($scope.currentLocation, true);

      GameState.updateTurn($scope.turnsLeft);
      GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);

      //tally district approval ratings
      $scope.totalReputations = GameState.getTotalReputation();

      //check if turns left is 0
      if($scope.turnsLeft === 0){
        $scope.config.state = 'end';
      }

    };



    $scope.onKapClicked = function(){
      $scope.config.state = 'kapitan';
      $scope.showItinerary = false;
    };

    $scope.onItClicked = function(){
      $scope.showItinerary = !$scope.showItinerary;
    };

    $scope.$watch('scheduledActivities', function(){
      //get the last movement location
      var futureLocationFound = false;
      for(var i = $scope.scheduledActivities.length-1; i >= 0; i--){
        var val = $scope.scheduledActivities[i];
        if(val.type === 'MOVE'){
          $scope.futureLocation = val.location;
          futureLocationFound = true;
          break;
        }
      }
      if(!futureLocationFound){
        $scope.futureLocation = $scope.currentLocation;
      }
      //get the total time
      var totalTime = $scope.scheduledActivities.reduce(function(a, b){
        return a + (b.cost.hours * b.location.timeCostModifier);
      }, 0);
      var totalCost = $scope.scheduledActivities.reduce(function(a, b){
        return a + (b.cost.gold*b.location.goldCostModifier);
      }, 0);
      $scope.timeLeft = $scope.hours.length - totalTime;
      $scope.totalCost = totalCost;
      if($scope.scheduledActivities && $scope.scheduledActivities.length > 0){
        Aisim.generateActivities($scope.activities, $scope.scheduledActivities);
      }
    }, true);

    $scope.$watch('cards', function(){
      if($scope.cards){
        console.log('Cards changed');
        //apply changes to the game world

      }
    }, true);

    $scope.$watch('timeLeft', function(){
      if(!$scope.selectedDistrict) {return;}
      $scope.selectedDistrict.activities.forEach(function(val){
        toggleDisable(val, shouldDisable);
      });
    }, true);

    $scope.findKapitan = function(id){
      var retVal = null;
      if(!$scope.kapitans) return null;
      $scope.kapitans.forEach(function(val){
        if(val.id === id){
          retVal = val;
        }
      });
      return retVal;
    };

    var isInSchedule = function(activity){
      var retVal = false;
      if(activity.type === 'MOVE'){
        return activity.location.id === $scope.futureLocation.id;
      }
      $scope.scheduledActivities.forEach(function(val){
        if(val.id === activity.id && val.location.id === activity.location.id){
          retVal = true;
        }
      });
      return retVal;
    };

    var toggleDisable = function(activity, willDisable){
      if(willDisable(activity)){
        activity.disabled = true;
      }else{
        activity.disabled = false;
      }
    };

    var howManyMovementScheduled = function(){
      var count = 0;
      $scope.scheduledActivities.forEach(function(val){
        if(val.type === 'MOVE'){
          count++;
        }
      });
      return count;
    };

    var shouldDisable = function(activity){
        if(activity.id === 4){
          if(_.every(activity.location.aiStance, function(val){
            return val === 0;
            })){
              return true;
          }
        }
        if(activity.type === 'MOVE'){
          //disable only if there are no other
          if(howManyMovementScheduled() === 0 &&
            activity.location.id === $scope.futureLocation.id){
            return true;
          }

          return $scope.timeLeft-activity.cost.hours < 0;
        }
        if(isInSchedule(activity)){
          return false;
        }
        if($scope.timeLeft - (activity.cost.hours*activity.location.timeCostModifier) < 0){
          return true;
        }
        if(activity.location.id !== $scope.futureLocation.id){
          return true;
        }
      };

    var removeFromSchedule = function(activity){
      var i;
      var length = 0;
      var val;
      for(i = $scope.scheduledActivities.length-1; i >= 0; i--){
        val = $scope.scheduledActivities[i];
        if(val.id === activity.id && val.location.id === activity.location.id){
          break;
        }
      }
      if(val.type === 'MOVE'){
        //remove everything forward
        for(var ii = i; ii < $scope.scheduledActivities.length; ii++){
          var val2 = $scope.scheduledActivities[ii];
          if(val2.location.id === activity.location.id){
            length+=1;
          }else{
            break;
          }
        }
        $scope.scheduledActivities.splice(i,length);
      }else{
        $scope.scheduledActivities.splice(i,1);
      }
    };

    var movePlayerToLocation = function(district, isHuman){
      $scope.districts.forEach(function(val){
        if(isHuman){
          if(val.id === district.id){
            val.hasHuman = true;
          }else{
            if(val.hasHuman){
              val.hasHuman = false;
            }
          }
        }else{
          if(val.id === district.id){
            val.hasAI = true;
          }else{
            if(val.hasAI){
              val.hasAI = false;
            }
          }
        }
      });
    };

    var wrapTurn = function(){
      //show result
      $scope.simulate.simulateText = 'End Day';
      $scope.simulate.activeAct = null;
      $scope.endTurn = true;
      //add budget contributions
      //TODO: List down extra curricular activities
      var extraMessage = '';
      if($scope.simulate.miscFunds > 0){
        extraMessage = 'Earned $' + $scope.simulate.miscFunds + ' from misc. activities';
      }else{
        extraMessage = 'Lost $' + $scope.simulate.miscFunds + ' to misc. items';
      }
      if($scope.simulate.miscFunds !== 0){
        $scope.simulate.summaries.push({
          text: extraMessage,
          cost: $scope.simulate.miscFunds,
          success: $scope.simulate.miscFunds > 0
        });
      }
      _.forEach($scope.cards, function(card){
        if(card.active){
          if(card.id === 'IdiotSon'){
            $scope.simulate.summaries.push({
              text: 'Lost $100 from our intern, Owlberto\'s son',
              cost: 100,
              success: false
            });
          }
        }
      });

      $scope.totalContribution = 0;
      angular.forEach($scope.districts, function(val){
        if(val.humanReputation - val.aiReputation >= 50){
          $scope.simulate.summaries.push({
            text: 'Campaign contributions from ' + val.name,
            cost: val.gold,
            success: true
          });
          $scope.totalContribution += val.gold;
        }
      });
    };

    var setStatForDistrict = function(statIndex, district, value, isHuman){
      var changedDistrict;
      $scope.districts.forEach(function(val){
        if(val.id === district.id){
          if(isHuman){
            val.humanStance[statIndex] += value;
          }else{
            val.aiStance[statIndex] += value;
          }
          changedDistrict = val;
        }
      });
      // $scope.$apply();
      return changedDistrict;
    };

    var processAIMove = function(aiResult){
      if(aiResult){
        var changedDistrict;
        var cost = (aiResult.cost.gold * aiResult.district.goldCostModifier) * -1;
        var text = '';
        if(aiResult.type === 'MOVE'){
          console.log('MOVING...');
          movePlayerToLocation(aiResult.district, false);
          GameState.aiStats.currentLocation = aiResult.district;
          $scope.simulate.aiSummaries.push({
            text: 'AI Moved to '+aiResult.district.name,
            success: true,
            cost: cost
          });
          //subtract cost
        }else if(aiResult.type === 'REPUTATION'){
          if(aiResult.success){
            changedDistrict = setReputationForDistrict(aiResult.value, aiResult.district, aiResult.isVs);
            if(aiResult.cost.morality && aiResult.cost.morality < 0){
              text = 'AI did something morally dubious to gain reputation.';
            }else{
              text = 'AI was able to increase their reputation in the area.';
            }
          }else{
            text = 'Tried to raise their reputation, but failed.';
          }
          $scope.simulate.aiSummaries.push({
            text: text,
            success: aiResult.success,
            cost: cost
          });
        }
        $scope.ai.totalCash += cost;
      }
    };

    var findDistrict = function(id){
      return _.find($scope.districts, function(val){
        return val.id === id;
      });
    };

    var setKapitanForDistrict = function(kapitan, district){
      var changedDistrict = _.find($scope.districts, function(val){
        return val.id === district.id;
      });
      changedDistrict.kapitan = kapitan;
      return changedDistrict;
    };

    var setReputationForDistrict = function(value, district, isHuman){
      var changedDistrict;
      $scope.districts.forEach(function(val){
        if(val.id === district.id){
          var reps = null;
          if(isHuman){
            reps = GameState.capReputation(val.humanReputation, val.aiReputation, value);
            val.humanReputation = reps.a;
            val.aiReputation = reps.b;
          }else{
            reps = GameState.capReputation(val.aiReputation, val.humanReputation, value);
            val.aiReputation = reps.a;
            val.humanReputation = reps.b;
          }
          changedDistrict = val;
        }
      });
      // $scope.$apply();
      return changedDistrict;
    };
  });
