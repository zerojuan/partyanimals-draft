'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $rootScope, $filter, $http, PAFirebase, GameState, Aisim) {
    $scope.dataLoadSize = 13;
    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalTurns = 25;
    $scope.daysInAWeek = 5;
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;
    $scope.showOverlay = true;
    $scope.hours = 10;
    $scope.hoursElapsed = 0;
    $scope.scheduledActivities = [];
    $scope.futureLocation = $scope.human.hq;
    $scope.currentLocation = $scope.human.hq;
    $scope.totalCost = 0;
    $scope.simulate = {
      simulateText: 'Start',
      isNextReady: false
    };
    $scope.updates = [];
    $scope.config = {
      alerts: [],
      state: 'home',
      loadedItems: 0,
      currentLoadedItem: '',
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

    var addDataCallbacks = function(){
      PAFirebase.staffersRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Sourcing staffers...';
        console.log($scope.config.currentLoadedItem);
        onDataChanged('staffers');
        $scope.staffers = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.traitsRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Evaluating multiple personalities...';
        console.log($scope.config.currentLoadedItem);
        onDataChanged('traits');
        $scope.traits = snapshot.val();
        $scope.$apply();
      });

      PAFirebase.workhoursRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Calculating workhours...';
        console.log($scope.config.currentLoadedItem);
        onDataChanged('workhours');
        var hours = snapshot.val();
        $scope.hours = hours;
        $scope.$apply();
      });

      PAFirebase.weekdaysRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Counting days in a week...';
        console.log($scope.config.currentLoadedItem);
        onDataChanged('weekdays');
        $scope.daysInAWeek = snapshot.val();
      });

      PAFirebase.cardsRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Drawing cards against humanity...';
        console.log($scope.config.currentLoadedItem);
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
        $scope.config.currentLoadedItem = 'Calculating budget savings...';
        console.log($scope.config.currentLoadedItem);
        if(!onDataChanged('initialGold')){
          $scope.totalCash = snapshot.val();
          $scope.human.totalCash = snapshot.val();
          $scope.ai.totalCash = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.turnsPerGameRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Counting election days...';
        console.log($scope.config.currentLoadedItem);
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
        $scope.config.currentLoadedItem = 'Canvassing districts...';
        console.log($scope.config.currentLoadedItem);
        if(!onDataChanged('districts')){
          $scope.districts = snapshot.val();
          var selectedDistrict = null;
          $scope.districts.forEach(function(district){
            var i = 0;
            district.humanReputation = district.humanReputation ? district.humanReputation : 0;
            district.aiReputation = district.aiReputation ? district.aiReputation : Math.random() * 10 + 5;
            district.humanStance = [0,0,0,0,0];
            district.aiStance = [0,0,0,0,0];
            district.humanReputations = [0];
            district.aiReputations = [0];
            //drip reputation to neighbors
            if(district.id === $scope.human.hq.id){
              district.isHQ = true;
              district.humanReputation = 60;
              district.hasHuman = true;
              for(i = 0; i < 5; i++){
                district.humanStance[i] = $scope.human.issueStats[i].level;
              }
              district.neighbors.forEach(function(neighborIndex){
                console.log('NeighborIndex:', neighborIndex);
                $scope.districts[neighborIndex].humanReputation = 25;
              });
              selectedDistrict = district;
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
        $scope.config.currentLoadedItem = 'Inciting issues...';
        console.log($scope.config.currentLoadedItem);
        if(!onDataChanged('issues')){
          $scope.issues = snapshot.val();
          $scope.$apply();
        }
      });

      PAFirebase.kapitansRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Convening the Kapitans...';
        console.log($scope.config.currentLoadedItem);
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
        $scope.config.currentLoadedItem = 'Recieving God\'s plans...';
        console.log($scope.config.currentLoadedItem);
        if(!onDataChanged('events')){
          $scope.eventsDb = snapshot.val();
          GameState.eventsDb = $scope.eventsDb;
        }
      });

      PAFirebase.activitiesRef.on('value', function(snapshot){
        $scope.config.loadedItems += 1;
        $scope.config.currentLoadedItem = 'Composing campaign jingles...';
        console.log($scope.config.currentLoadedItem);
        if(!onDataChanged('activities')){
          $scope.activities = snapshot.val();
          $scope.$apply();
        }
      });
    };

    addDataCallbacks();

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
        $scope.human.staff.push($scope.staffers[1]);
        $scope.human.staff.push($scope.staffers[2]);

        //hide welcome paper for now
        $scope.onHideOverlay();

        $rootScope.$broadcast('GAME:start');
      }
    });

    $scope.$on('CANVAS:ready', function(){
      $scope.config.loadedItems += 1;
      $scope.config.currentLoadedItem = 'Setting the political canvas...';
      $scope.$apply();
      console.log($scope.config.currentLoadedItem);
    });

    var resolveActivity = function(actor){
      $scope.updates.push(actor);
      //resolve activity
      if(actor.activity.type === 'REPUTATION'){
        console.log('THIS IS A REPUTATION POST');
        var district = GameState.findDistrict(actor.activity.district.id, $scope.districts);
        district.humanReputation+=30;
        GameState.districts = $scope.districts;
      }
      $rootScope.$broadcast('GAME:ACTION:result', actor);
    };

    var endActivity = function(staff){
      var district = GameState.findDistrict(staff.activity.district.id, $scope.districts);
      var index = 0;
      if(staff.id !== null && staff.id !== undefined ){

        var realStaff = GameState.findStaff(staff.id, $scope.human.staff);
        index = _.findIndex(district.actors, function(actor){
          return actor.id === staff.id;
        });

        resolveActivity(angular.copy(realStaff));
        realStaff.activity = null;

      }else{
        index = _.findIndex(district.actors, function(actor){
          return actor.name === $scope.human.name;
        });

        resolveActivity(angular.copy($scope.human));
        $scope.human.activity = null;
      }
      district.actors.splice(index,1);
      $rootScope.$broadcast('GAME:resolve');
    };

    $scope.$watch('hoursElapsed', function(newVal, oldVal){
      var elapsed = newVal-oldVal;
      if(elapsed < 0){
        elapsed = 5;
      }

      if($scope.human.activity){
        $scope.human.activity.details.hoursPassed+=elapsed;
        endActivity($scope.human);
      }

      _.forEach($scope.human.staff, function(staff){
        if(staff.activity){

          staff.activity.details.hoursPassed+=elapsed;
          if(staff.activity.details.hoursPassed >= staff.activity.details.hours){
            //done!!
            endActivity(staff);
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
      _.forEach($scope.activities, function(activity){
        var nActivity = angular.copy(activity);
        var isValid = true;
        if(activity.restrictions){
          _.forEach(activity.restrictions, function(restriction){
            if(restriction === 'DISTRICT-1' && $scope.selectedDistrict.id !== 1){
              isValid = false;
              return false;
            }else if(restriction === 'DISTRICT-4' && $scope.selectedDistrict.id !== 4){
              isValid = false;
              return false;
            }else if(restriction === -1){
              isValid = false;
              return false;
            }
          });
        }
        if(isValid){
          nActivity.district = {
            name: $scope.selectedDistrict.name,
            id: $scope.selectedDistrict.id
          };
          activities.push(nActivity);
        }
      });

      $scope.selectedDistrict.activities = activities;

      $scope.$apply();
    };

    $scope.onActivityConfigDone = function(confdActivity){
      $scope.onHideOverlay();
      //set actor to task
      var staff = GameState.findStaff(confdActivity.details.actor.id, $scope.human.staff);
      if(staff){
        staff.activity = confdActivity;
      }else{
        //this is you
        $scope.human.activity = confdActivity;
        staff = $scope.human;
      }
      confdActivity.details.startTime = $scope.hoursElapsed;

      //set district to contain actor
      if(!$scope.selectedDistrict.actors){
        $scope.selectedDistrict.actors = [];
      }
      $scope.selectedDistrict.actors.push(staff);
      $rootScope.$broadcast('GAME:assign');
    };

    $scope.onEndDay = function(){

    };

    function shouldNextDay(){
      if($scope.hoursElapsed >= $scope.hours){
        $scope.hoursElapsed = 0;
        $scope.turnsLeft--;
        return true;
      }
      return false;
    }

    $scope.onNext = function(){
      $scope.hoursElapsed += $scope.human.activity.details.hours;
      shouldNextDay();
    };

    $scope.onRest = function(){
      if(!shouldNextDay()){
        $scope.hoursElapsed += 1;
      }
    };
  });
