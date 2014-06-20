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
