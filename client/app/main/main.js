'use strict';

angular.module('partyanimalsDraftApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          platformPoints: ['$q', 'PAFirebase', function($q, PAFirebase){
            var deferred = $q.defer();

            PAFirebase.platformPointsRef.on('value', function(snapshot){
              deferred.resolve(snapshot.val());
            });
            return deferred.promise;
          }],
          issues: ['$q', 'PAFirebase', function($q, PAFirebase){
            var deferred = $q.defer();
            PAFirebase.issuesRef.on('value', function(snapshot){
              deferred.resolve(snapshot.val());
            });
            return deferred.promise;
          }],
          districts: ['$q', 'PAFirebase', function($q, PAFirebase){
            var deferred = $q.defer();
            PAFirebase.districtsRef.on('value',function(snapshot){
              var districts = snapshot.val();
              _.forEach(districts, function(val){
                val.humanReputation = 0;
                val.aiReputation = false;
              });
              deferred.resolve(districts);
            });
            return deferred.promise;
          }]
        }
      })
      .state('game', {
        url: '/game',
        templateUrl: 'app/game/game.html',
        controller: 'GameCtrl'
      })
      .state('endgame', {
        url: '/endgame',
        templateUrl: 'app/endgame-test/index.html',
        controller: 'EndgameTest'
      });
  });
