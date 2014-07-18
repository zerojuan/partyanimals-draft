'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $http, PAFirebase, GameState) {

    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;
    $scope.hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
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
    $scope.human.morality = 50;
    $scope.human.doneEvents = [];

    PAFirebase.workhoursRef.on('value', function(snapshot){
      onDataChanged('workhours');
      var hours = snapshot.val();
      $scope.hours = [];
      for(var i = 0; i < hours; i++){
        $scope.hours.push(9+i);
      }
      $scope.$apply();
    });

    PAFirebase.goldRef.on('value', function(snapshot){
      if(!onDataChanged('initialGold')){
        $scope.totalCash = snapshot.val();
        $scope.$apply();
      }
    });

    PAFirebase.turnsPerGameRef.on('value', function(snapshot){
      if(!onDataChanged('turnsPerGame')){
        $scope.turnsLeft = snapshot.val();
        $scope.$apply();
      }
    });

    PAFirebase.districtsRef.on('value', function(snapshot){
      if(!onDataChanged('districts')){
        $scope.districts = snapshot.val();
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
          }
          if(val.id === $scope.ai.hq.id){
            val.isAIHQ = true;
            val.hasAI = true;
            val.aiReputation = 50;
            for(i = 0; i < 5; i++){
              val.aiStance[i] = $scope.ai.issueStats[i].level;
            }
            $scope.ai.hq = val;
          }
        });
        GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);

        //tally district approval ratings
        $scope.totalReputations = GameState.getTotalReputation();
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
      if(!onDataChanged('kapitans')){
        $scope.kapitans = snapshot.val();
        angular.forEach($scope.kapitans, function(val){
          val.humanRelations = 50;
          val.aiRelations = 50;
        });
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
        $scope.$apply();
      }
    });

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
      $scope.selectedDistrict = district;
      $scope.selectedDistrict.selected = true;
      $scope.selectedDistrict.kapitan = $scope.findKapitan($scope.selectedDistrict.kapitanId);
      $scope.selectedDistrict.activities = [];
      if($scope.selectedDistrict.specialistId){
        $scope.selectedDistrict.specialist = $scope.findKapitan($scope.selectedDistrict.specialistId);
      }
      //load activities for this item
      var moveActivity, inFutureLocation = null;
      inFutureLocation = $scope.futureLocation.id === $scope.selectedDistrict.id;


      moveActivity = {
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
        location: angular.copy($scope.selectedDistrict)
      };
      moveActivity.cost = calculateMovementCost($scope.futureLocation, $scope.selectedDistrict);

      if(isInSchedule(moveActivity)){
        moveActivity.wasScheduled = true;
      }

      toggleDisable(moveActivity, shouldDisable);

      var activities = $scope.activities.map(function(val){
        var newVal = angular.copy(val);
        newVal.location = angular.copy($scope.selectedDistrict);
        //check if this is already selected
        if(isInSchedule(newVal)){
          newVal.wasScheduled = true;
        }
        //check if we are in the future location
        toggleDisable(newVal, shouldDisable);

        return newVal;
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
      $scope.simulate.isNextReady = true;
      $scope.showOverlay = true;
      $scope.endTurn = false;
      actIndex = 0;
      GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);
    };


    $scope.simulate.onNext = function(){
      if(actIndex > $scope.scheduledActivities.length-1){
        //show result
        //TODO: show results page
        $scope.simulate.simulateText = 'End Day';
        $scope.simulate.activeAct = null;
        $scope.endTurn = true;
        //add budget contributions
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
        var cost = result.cost.gold * -1;
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
          $scope.human.met[kapitan.id] += 1;
          $scope.simulate.summaries.push({
            text: 'Talked with the Kapitan',
            success: true,
            cost: cost
          });
        }else if(result.type === 'MOVE'){
          $scope.simulate.summaries.push({
            text: 'Travelled to ' + result.district.name,
            success: result.success,
            cost: cost
          });
        }
      }
      $scope.simulate.isNextReady = true;
    };

    $scope.simulate.onEndTurn = function(){
      //ui reset
      $scope.showItinerary = false;
      $scope.showOverlay = false;
      $scope.endTurn = false;

      //advance game state
      $scope.totalCash = $scope.totalCash - $scope.totalCost + $scope.totalContribution;
      $scope.turnsLeft -= 1;
      $scope.scheduledActivities = [];
      $scope.currentLocation = $scope.futureLocation;

      $scope.selectedDistrict.selected = false;
      $scope.selectedDistrict = null;
      movePlayerToLocation($scope.currentLocation, true);
      GameState.updateTurn($scope.turnsLeft);
      GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);

      //tally district approval ratings
      $scope.totalReputations = GameState.getTotalReputation();
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
        return a + b.cost.hours;
      }, 0);
      var totalCost = $scope.scheduledActivities.reduce(function(a, b){
        return a + b.cost.gold;
      }, 0);
      $scope.timeLeft = $scope.hours.length - totalTime;
      $scope.totalCost = totalCost;
    }, true);

    $scope.$watch('timeLeft', function(){
      if(!$scope.selectedDistrict) {return;}
      $scope.selectedDistrict.activities.forEach(function(val){
        toggleDisable(val, shouldDisable);
      });
    }, true);

    $scope.findKapitan = function(id){
      var retVal = null;
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

    var calculateMovementCost = function(start, end){
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

    var shouldDisable = function(activity){
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
        if($scope.timeLeft - activity.cost.hours < 0){
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

    var setReputationForDistrict = function(value, district, isHuman){
      var changedDistrict;
      $scope.districts.forEach(function(val){
        if(val.id === district.id){
          if(isHuman){
            val.humanReputation += value;
          }else{
            val.aiReputation += value;
          }
          changedDistrict = val;
        }
      });
      // $scope.$apply();
      return changedDistrict;
    };
  });
