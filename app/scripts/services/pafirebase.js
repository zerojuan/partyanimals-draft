'use strict';

/**
 * @ngdoc service
 * @name partyanimalsDraftApp.PAFirebase
 * @description
 * # PAFirebase
 * Service in the partyanimalsDraftApp.
 */
angular.module('partyanimalsDraftApp')
  .service('PAFirebase', function Pafirebase() {
    var url = 'https://partyanimals-data.firebaseio.com';
    this.platformPointsRef = new Firebase(url+'/platformPoints');
    this.goldRef = new Firebase(url+'/gold');
    this.districtsRef = new Firebase(url+'/districts');
    this.issuesRef = new Firebase(url+'/issues');
    this.kapitansRef = new Firebase(url+'/kapitan');
    this.activitiesRef = new Firebase(url+'/activities');
    this.turnsPerGameRef = new Firebase(url+'/turnsPerGame');
  });