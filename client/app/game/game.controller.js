'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $rootScope, $filter, $http, PAFirebase, GameState, Aisim, Ruleset, GameModel) {
    $scope.dataLoadSize = 13;
    $scope.human = GameState.getHuman();
    $scope.human.team = 'HUMAN';
    $scope.ai = GameState.getAI();
    $scope.ai.team = 'AI';
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalTurns = 30;
    $scope.daysInAWeek = 5;
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;
    $scope.showOverlay = true;
    $scope.hours = 10;
    $scope.daysElapsed = 0;
    $scope.scheduledActivities = [];
    $scope.futureLocation = $scope.human.hq;
    $scope.currentLocation = $scope.human.hq;
    $scope.totalCost = 0;
    $scope.simulate = {
      simulateText: 'Start',
      isNextReady: false
    };
    $scope.updates = [];
    $scope.notifications = [];
    $scope.config = {
      alerts: [],
      state: 'home',
      loadedItems: 0,
      currentLoadedItem: 'Loading...',
      overlayState: 'WELCOME' //WELCOME, EVENT, SIMULATION, WEEKLY
    };
    $scope.currentPlayer = $scope.human;

    $scope.human.bribe = 0;
    $scope.human.met = [0,0,0,0,0,0,0,0,0];
    $scope.human.totalCash = $scope.totalCash;
    $scope.human.morality = 50;
    $scope.human.doneEvents = [];

    $rootScope.$on('$stateChangeSuccess',
      function(){
      $scope.config.loadedItems = 0;
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

    var setLoadingMessage = function(message){
      $scope.config.currentLoadedItem = message;
      console.log(message);
    };

    var addDataCallbacks = function(){
      PAFirebase.staffersRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Sourcing staffers...');

        onDataChanged('staffers');
        $scope.staffers = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.traitsRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Evaluating multiple personalities...');

        onDataChanged('traits');
        $scope.traits = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.workdaysRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Calculating workdays...');

        onDataChanged('workdays');
        $scope.days = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.weekdaysRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Counting days in a week...');

        onDataChanged('weekdays');
        $scope.daysInAWeek = snapshot.val();
      });

      PAFirebase.cardsRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Drawing cards against humanity...');

        onDataChanged('cards');
        $scope.cards = snapshot.val();
        _.forEach($scope.cards, function(val){
          val.done = false;
          val.active = false;
        });
        GameState.cards = $scope.cards;
        $scope.$apply();
      });

      PAFirebase.goldRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Calculating budget savings...');

        if(!onDataChanged('initialGold')){
          $scope.totalCash = snapshot.val();
          $scope.human.totalCash = snapshot.val();
          $scope.ai.totalCash = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.turnsPerGameRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Counting election days...');

        if(!onDataChanged('turnsPerGame')){
          // $scope.turnsLeft = 1;
          // $scope.totalTurns = 1;
          $scope.turnsLeft = snapshot.val();
          $scope.totalTurns = snapshot.val();

          GameState.turnsLeft = $scope.turnsLeft;
          $scope.$apply();
        }
      });

      PAFirebase.districtsRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Canvassing districts...');

        if(!onDataChanged('districts')){
          $scope.districts = snapshot.val();
          var selectedDistrict = null;
          //district bonuses
          var districtBonus = [
            0, //EDUCATION
            2, //LAW AND ORDER
            1, //EMPLOYMENT
            1, //EMPLOYMENT
            4, //RELIGION,
            3 //HEALTH
          ];

          $scope.districts.forEach(function(district){
            var i = 0;
            district.humanReputation = district.humanReputation ? district.humanReputation : 0;
            district.aiReputation = district.aiReputation ? district.aiReputation : Math.random() * 10 + 5;
            district.humanStance = [0,0,0,0,0];
            district.aiStance = [0,0,0,0,0];
            district.humanReputations = [0];
            district.aiReputations = [0];
            district.humanActors = [];
            district.aiActors = [];
            //drip reputation to neighbors
            if(district.id === $scope.human.hq.id){
              district.isHQ = true;
              district.humanReputation = 60;
              district.hasHuman = true;
              for(i = 0; i < 5; i++){
                district.humanStance[i] = $scope.human.issueStats[i].level;
              }
              district.neighbors.forEach(function(neighborIndex){
                $scope.districts[neighborIndex].humanReputation = 25;
              });
              selectedDistrict = district;
              $scope.human.currentLocation = district;
            }
            if(district.id === $scope.ai.hq.id){
              district.isAIHQ = true;
              district.hasAI = true;
              district.aiReputation = 60;
              for(i = 0; i < 5; i++){
                district.aiStance[i] = $scope.ai.issueStats[i].level;
              }
              district.neighbors.forEach(function(neighborIndex){
                $scope.districts[neighborIndex].aiReputation = 20;
              });
              $scope.ai.hq = district;
              $scope.ai.currentLocation = district;
            }

            //add bonus stat
            if(district.aiStance[districtBonus[$scope.ai.hq.id]] < 5){
              district.aiStance[districtBonus[$scope.ai.hq.id]]+=1;
            }

            if(district.humanStance[districtBonus[$scope.human.hq.id]] < 5){
              district.humanStance[districtBonus[$scope.human.hq.id]]+=1;
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

          $scope.$apply();

        }
      });

      PAFirebase.issuesRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Inciting issues...');

        if(!onDataChanged('issues')){
          $scope.issues = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.kapitansRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Convening the Kapitans...');

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
        $scope.config.loadedItems += 1;
        setLoadingMessage('Recieving God\'s Plans...');

        if(!onDataChanged('events')){
          $scope.eventsDb = snapshot.val();
          GameState.eventsDb = $scope.eventsDb;
        }
      });

      PAFirebase.activitiesRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        setLoadingMessage('Composing campaign jingles...');

        if(!onDataChanged('activities')){
          $scope.activities = snapshot.val();
          $scope.$apply();
        }
      });
    };

    addDataCallbacks();

    var insertAiActions = function(actions){
      _.forEach(actions, function(action){
        //this is something here
        var staff = GameState.findStaff(action.details.actor.id, $scope.ai.staff);
        var selectedDistrict = GameState.findDistrict(action.district.id, $scope.districts);
        var isCandidate = false;
        if(staff){
          //this is your staff
          staff.activity = action;
        }else{
          //this is you, the candidate
          $scope.ai.activity = action;
          staff = $scope.ai;
          isCandidate = true;
        }

        if(!selectedDistrict.aiActors){
          selectedDistrict.aiActors = [];
        }

        assignActivity(staff, isCandidate, false, selectedDistrict, selectedDistrict.aiActors);
      });
    };

    $scope.$watch('config.loadedItems', function(){
      console.log($scope.config.loadedItems +' vs '+ $scope.dataLoadSize);
      if($scope.config.loadedItems === $scope.dataLoadSize){
        console.log('Time to start the game...');
        GameState.updateGameState($scope.human, $scope.ai, $scope.districts, $scope.kapitans, $scope.issues);
        GameState.updateDistrictReputationHistory($scope.districts);
        $scope.totalReputations = GameState.getTotalReputation();
        //combine traits to the staffers
        _.forEach($scope.staffers, function(staffer){
          staffer.traits = [];
          _.forEach(staffer.traitsId, function(val){
            staffer.traits.push(GameState.findTrait(val, $scope.traits));
          });
        });

        $scope.human.staff = [];
        $scope.human.staff.push($scope.staffers[0]);
        $scope.staffers[0].team = 'HUMAN';
        $scope.human.staff.push($scope.staffers[1]);
        $scope.staffers[1].team = 'HUMAN';
        $scope.human.staff.push($scope.staffers[2]);
        $scope.staffers[2].team = 'HUMAN';


        Aisim.ai = $scope.ai;
        $scope.ai.staff = [];
        $scope.ai.staff.push($scope.staffers[3]);
        $scope.staffers[3].team = 'AI';
        $scope.ai.staff.push($scope.staffers[4]);
        $scope.staffers[4].team = 'AI';
        $scope.ai.staff.push($scope.staffers[5]);
        $scope.staffers[5].team = 'AI';

        //hide welcome paper for now
        $scope.onHideOverlay();

        $rootScope.$broadcast('GAME:start');

        //set AI movement
        var actions = Aisim.proposeAction($scope.ai, $scope.districts, $scope.activities);
        insertAiActions(actions);
      }
    });

    $scope.$on('CANVAS:ready', function(){
      $scope.config.loadedItems += 1;
      setLoadingMessage('Setting the political canvas...');

      $scope.$apply();
    });

    var resolveActivity = function(actor, isCandidate, isHuman){
      $scope.updates.unshift(actor);
      $scope.notifications.unshift(actor);
      var eventSuffix = '';
      if(!isHuman){
        eventSuffix = '_ai';
      }
      //resolve activity
      var district = GameState.findDistrict(actor.activity.district.id, $scope.districts);
      var reputation;
      if(actor.activity.type === 'REPUTATION'){
        if(isHuman){
          reputation = GameState.capReputation(district.humanReputation, district.aiReputation, 30);
          district.humanReputation = reputation.a;
          district.aiReputation = reputation.b;
        }else{
          reputation = GameState.capReputation(district.aiReputation, district.humanReputation, 30);
          district.aiReputation = reputation.a;
          district.humanReputation = reputation.b;
        }

        GameState.districts = $scope.districts;
      }else if(actor.activity.type === 'STAT'){
        if(actor.activity.details.isVs){
          //subtract enemy ai
          if(isHuman){
            district.aiStance[actor.activity.details.selectedIssue] -= 1;
          }else{
            district.humanStance[actor.activity.details.selectedIssue] -= 1;
          }
        }else{
          if(isHuman){
            district.humanStance[actor.activity.details.selectedIssue] += 1;
          }else{
            district.aiStance[actor.activity.details.selectedIssue] += 1;
          }
        }
      }else if(actor.activity.type === 'SORTIE'){
        if(isHuman){
          reputation = GameState.capReputation(district.humanReputation, district.aiReputation, 40);
          district.humanReputation = reputation.a;
          district.aiReputation = reputation.b;
        }else{
          reputation = GameState.capReputation(district.aiReputation, district.humanReputation, 40);
          district.aiReputation = reputation.a;
          district.humanReputation = reputation.b;
        }
      }

      if(isCandidate){
        $rootScope.$broadcast('GAME:ACTION:candidate_result'+eventSuffix, actor);
      }else{
        $rootScope.$broadcast('GAME:ACTION:result'+eventSuffix, actor);
      }


    };

    var cancelActivity = function(staff){
      var district = GameState.findDistrict(staff.activity.district.id, $scope.districts);
      var actors = district.humanActors;
      var staffList = $scope.human.staff;
      var index = 0;

      if(staff.id !== null && staff.id !== undefined){
        var realStaff = GameState.findStaff(staff.id, staffList);

        index = _.findIndex(actors, function(actor){
          return actor.id === staff.id;
        });
        $scope.totalCash += realStaff.activity.details.cost;
        realStaff.activity = null;
        $rootScope.$broadcast('GAME:cancel', realStaff);
      }else{
        index = _.findIndex(actors, function(actor){
          return actor.name === $scope.human.name;
        });
        $scope.totalCash += $scope.human.activity.details.cost;
        $scope.human.activity = null;
      }

      actors.splice(index, 1);

    };

    var endActivity = function(staff, staffList, isHuman){
      var district = GameState.findDistrict(staff.activity.district.id, $scope.districts);
      var index = 0;
      var actors = isHuman? district.humanActors:district.aiActors;
      var candidate = isHuman? $scope.human : $scope.ai;

      if(staff.id !== null && staff.id !== undefined ){
        var realStaff = GameState.findStaff(staff.id, staffList);

        index = _.findIndex(actors, function(actor){
          return actor.id === staff.id;
        });

        resolveActivity(angular.copy(realStaff), false, isHuman);
        realStaff.activity = null;

      }else{
        index = _.findIndex(actors, function(actor){
          return actor.name === candidate.name;
        });

        resolveActivity(angular.copy(candidate), true, isHuman);
        candidate.activity = null;
        candidate.currentLocation = district;
      }
      actors.splice(index,1);
      $rootScope.$broadcast('GAME:resolve');
    };

    $scope.$watch('daysElapsed', function(newVal, oldVal){
      var elapsed = newVal-oldVal;
      if(elapsed < 0){
        elapsed = 5;
      }

      if($scope.human.activity){
        $scope.human.activity.details.daysPassed+=elapsed;
        if($scope.human.activity.details.daysPassed>=$scope.human.activity.details.days){
          $scope.onShowOverlay('RESOLVE');
        }
      }

      if($scope.ai.activity){
        $scope.ai.activity.details.daysPassed+=elapsed;
        if($scope.ai.activity.details.daysPassed>=$scope.ai.activity.details.days){
          endActivity($scope.ai, $scope.ai.staff, false);
        }
      }

      _.forEach($scope.human.staff, function(staff){
        if(staff.activity){

          staff.activity.details.daysPassed+=elapsed;
          if(staff.activity.details.daysPassed >= staff.activity.details.days){
            //done!!
            endActivity(staff, $scope.human.staff, true);
          }
        }
      });

      _.forEach($scope.ai.staff, function(staff){
        if(staff.activity){
          staff.activity.details.daysPassed+=elapsed;
          if(staff.activity.details.daysPassed >= staff.activity.details.days){
            endActivity(staff, $scope.ai.staff, false);
          }
        }
      });
    });

    $scope.onHideOverlay = function(){
      $scope.showOverlay = false;
      $scope.config.overlayState = 'HIDDEN';
    };

    $scope.onShowOverlay = function(state){
      $scope.showOverlay = true;
      $scope.config.overlayState = state;
    };

    $scope.closeDistrictDetails = function(){
      $scope.selectedDistrict = null;
    };

    $scope.closeNotification = function(index){
      var notification = $scope.notifications[index];
      var update = _.find($scope.updates, function(update){
        return update == notification;
      });
      update.seen = true;
      $scope.notifications.splice(index, 1);

    };

    $scope.onActivitySelected = function(activity){
      $scope.onShowOverlay('ACTIVITY');
      $scope.selectedActivity = activity;
    };

    $scope.selectDistrict = function(id){
      $scope.selectedDistrict = GameState.findDistrict(id, $scope.districts);
      //supply selected district with a kapitan
      $scope.selectedDistrict.kapitan = GameState.findKapitan($scope.selectedDistrict.kapitanId);

      //supply selected district with actions
      var activities = [];

      //add move action
      if($scope.selectedDistrict.name !== $scope.human.currentLocation.name){
        //add move action
        activities.push(GameModel.createMoveActivity(GameModel.cloneDistrict($scope.selectedDistrict)));
      }

      _.forEach($scope.activities, function(activity){
        var nActivity = angular.copy(activity);
        var isValid = Ruleset.Restrictions.isValidActionFromRestriction(activity.restrictions, $scope.selectedDistrict);

        if($scope.selectedDistrict.name !== $scope.human.currentLocation.name){
          if(nActivity.type === 'SORTIE' || nActivity.type === 'TALK'){
            return;
          }
        }

        if(isValid){
          nActivity.district = GameModel.cloneDistrict($scope.selectedDistrict);

          nActivity.travelTime = Ruleset.calculateTravelCost($scope.currentLocation, $scope.selectedDistrict);
          activities.push(nActivity);
        }
      });

      $scope.selectedDistrict.activities = activities;

      $scope.$apply();
    };

    var assignActivity = function(staff, isCandidate, isHuman, district, staffers){
      //set district to contain actor
      staffers.push(staff);

      //count how many staffers are here
      for(var i = 0, position = 0; i < staffers.length; i++){
        if(staffers[i].id !== undefined){
          if(staff === staffers[i]){
            staff.position = position;
          }
          position++;
        }
      }
      staff.districtName = district.name;
      staff.activity.details.startTime = $scope.daysElapsed;

      //handle staff and candidate assignment differently
      var eventName = '';
      if(!isHuman){
        eventName = '_ai';
      }else{
        $scope.totalCash -= staff.activity.details.cost;
      }

      //subtract to money


      if(isCandidate){
        $rootScope.$broadcast('GAME:assign_candidate'+eventName, staff);
      }else{
        $rootScope.$broadcast('GAME:assign'+eventName, staff);
      }
    };

    $scope.onActivityConfigDone = function(confdActivity){
      $scope.onHideOverlay();
      //set actor to task
      var staff = GameState.findStaff(confdActivity.details.actor.id, $scope.human.staff);
      var isCandidate = false;
      if(staff){
        //this is your staff
        staff.activity = confdActivity;
      }else{
        //this is you, the candidate
        $scope.human.activity = confdActivity;
        staff = $scope.human;
        isCandidate = true;
      }

      if(!$scope.selectedDistrict.humanActors){
        $scope.selectedDistrict.humanActors = [];
      }

      assignActivity(staff, isCandidate, true, $scope.selectedDistrict, $scope.selectedDistrict.humanActors);

    };

    function move1Day(){
      $scope.notifications = [];
      $scope.daysElapsed+=1;
      updateTurn();
      var aiMoves = Aisim.proposeAction($scope.ai, $scope.districts, $scope.activities);
      insertAiActions(aiMoves);
    }

    function updateTurn(){
      $scope.turnsLeft--;
      GameState.updateTurn($scope.turnsLeft);
      $scope.closeDistrictDetails();
      GameState.updateDistrictReputationHistory($scope.districts);
      $scope.totalReputations = GameState.getTotalReputation();
      $rootScope.$broadcast('GAME:turn');
    }

    $scope.onRest = function(){
      move1Day();
    };

    $scope.onCancel = function(actor){
      console.log('Cancelling action', actor);
      if(actor.activity.details.daysPassed === 0){
        //remove from list of activities
        cancelActivity(actor);
      }
    };

    $scope.onNextReady = function(){
      $scope.onHideOverlay();
      endActivity($scope.human, $scope.human.staff, true);
    };

  });
