'use strict';

angular.module('partyanimalsDraftApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('game', {
        url: '/game',
        templateUrl: 'app/game/game.html',
        controller: 'GameCtrl'
      });
  });
