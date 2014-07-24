'use strict';

angular.module('partyanimalsDraftApp')
  .service('PAFirebase', function Pafirebase() {
    var url = 'https://partyanimals-data.firebaseio.com';
    var that = this;
    that.platformPointsRef = new Firebase(url+'/platformPoints');
    that.goldRef = new Firebase(url+'/gold');
    that.districtsRef = new Firebase(url+'/districts');
    that.issuesRef = new Firebase(url+'/issues');
    that.kapitansRef = new Firebase(url+'/kapitan');
    that.activitiesRef = new Firebase(url+'/activities');
    that.turnsPerGameRef = new Firebase(url+'/turnsPerGame');
    that.workhoursRef = new Firebase(url+'/workhours');
    that.eventsRef = new Firebase(url+'/events');
    that.cardsRef = new Firebase(url+'/cards');

    that.removeCallbacks = function(){
      that.platformPointsRef.off();
      that.goldRef.off();
      that.districtsRef.off();
      that.issuesRef.off();
      that.kapitansRef.off();
      that.activitiesRef.off();
      that.turnsPerGameRef.off();
      that.workhoursRef.off();
      that.eventsRef.off();
      that.cardsRef.off();
    };
  });
