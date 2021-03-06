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
    that.activitiesRef = new Firebase(url+'/activitiesnew');
    that.turnsPerGameRef = new Firebase(url+'/turnsPerGame');
    that.workdaysRef = new Firebase(url+'/workhours');
    that.eventsRef = new Firebase(url+'/events');
    that.cardsRef = new Firebase(url+'/cards');
    that.weekdaysRef = new Firebase(url+'/weekdays');
    that.staffersRef = new Firebase(url+'/staffers');
    that.traitsRef = new Firebase(url+'/traits');

    that.removeCallbacks = function(){
      that.weekdaysRef.off();
      that.platformPointsRef.off();
      that.goldRef.off();
      that.districtsRef.off();
      that.issuesRef.off();
      that.kapitansRef.off();
      that.activitiesRef.off();
      that.turnsPerGameRef.off();
      that.workdaysRef.off();
      that.eventsRef.off();
      that.cardsRef.off();
      that.staffersRef.off();
      that.traitsRef.off();
    };
  });
