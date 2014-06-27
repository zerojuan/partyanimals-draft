'use strict';

angular.module('partyanimalsDraftApp')
  .controller('GameCtrl', function ($scope, $http, GameState) {

    $scope.state = 'home';
    $scope.human = GameState.getHuman();
    $scope.ai = GameState.getAI();
    $scope.turnsLeft = GameState.getTurnsLeft();
    $scope.totalCash = GameState.getInitialCash();
    $scope.showItinerary = false;
    $scope.hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22, 23, 24];
    $scope.scheduledActivities = [];
    $scope.futureLocation = $scope.human.hq;
    $scope.currentLocation = $scope.human.hq;

    $http.get('/api/districts').success(function(districts){
      $scope.districts = districts;
      $scope.districts.forEach(function(val){
        if(val.id === $scope.human.hq.id){
          val.isHQ = true;
          val.hasHuman = true;
        }
        if(val.id === $scope.ai.hq.id){
          val.isAIHQ = true;
          val.hasAI = true;
          $scope.ai.hq = val;
        }
      });
    });

    $http.get('/api/issues').success(function(issues) {
      $scope.issues = issues;
    });

    $http.get('/api/kapitans').success(function(kapitans){
      $scope.kapitans = kapitans;
    });

    $http.get('/api/activities').success(function(activities){
      $scope.activities = activities;
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
          //TODO: if movement was removed remove every act inside this location until end of list or encounter a new move type
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
      $scope.selectedDistrict.kapitan = findKapitan($scope.selectedDistrict.kapitanId);
      $scope.selectedDistrict.activities = [];
      //load activities for this item
      var moveActivity, inFutureLocation = null;
      inFutureLocation = $scope.futureLocation.id === $scope.selectedDistrict.id;


        //TODO: calculate cost based on location
      moveActivity = {
        id: -1,
        type: 'MOVE',
        name: 'Move Here',
        cost: {
          gold: 100,
          hours: 3
        },
        disabled: false,
        location: angular.copy($scope.selectedDistrict)
      };

      if(isInSchedule(moveActivity)){
        moveActivity.wasScheduled = true;
      }

      toggleDisable(moveActivity, shouldDisable);

      var activities = $scope.activities.map(function(val){
        var newVal = angular.copy(val);
        newVal.location = angular.copy($scope.selectedDistrict);
        //check if this is already selected
        if(isInSchedule(newVal)){
          console.log('Was already selected');
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

    $scope.onKapSelected = function(kapitan){
      if($scope.selectedKapitan){
        $scope.selectedKapitan.active = false;
      }
      $scope.selectedKapitan = kapitan;
      $scope.selectedKapitan.active = true;
      //likes
      var likesData = [];
      $scope.selectedKapitan.likes.forEach(function(val){
        likesData.push(findKapitan(val));
      });
      var hatesData = [];
      $scope.selectedKapitan.hates.forEach(function(val){
        hatesData.push(findKapitan(val));
      });
      $scope.selectedKapitan.likesData = likesData;
      $scope.selectedKapitan.hatesData = hatesData;
    };

    $scope.onKapClicked = function(){
      $scope.state = 'kapitan';
      $scope.showItinerary = false;
    };

    $scope.onItClicked = function(){
      $scope.showItinerary = !$scope.showItinerary;
    };

    $scope.onBackHome = function(){
      $scope.state = 'home';
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
      $scope.timeLeft = $scope.hours.length - totalTime;
    }, true);

    $scope.$watch('timeLeft', function(){
      if(!$scope.selectedDistrict) {return;}
      $scope.selectedDistrict.activities.forEach(function(val){
        toggleDisable(val, shouldDisable);
      });
    }, true);

    var findKapitan = function(id){
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
  });
