'use strict';

angular.module('partyanimalsDraftApp')
  .service('NewspaperService', function Newspaperservice() {

    var that = this;
    this.setupCandidates = function(human, ai, issues){
      that.human = human;
      that.ai = ai;
      that.issues = issues;
    };

    /**
    * @arg actor who is the doer of this headline
    * @arg isHidden true if this action should not be explicit (raises reputation instead of smear?)
    */
    this.createHeadline = function(actor, isHidden){
      var isOwnCandidate;
      var myCandidateName;
      var myOpponentName;
      if(actor.team === 'HUMAN'){
        isOwnCandidate = actor.name === that.human.name;
        myCandidateName = that.human.name;
        myOpponentName = that.ai.name;
      }

      if(actor.team === 'AI'){
        isOwnCandidate = actor.name === that.ai.name;
        myCandidateName = that.ai.name;
        myOpponentName = that.human.name;
      }

      if(actor.activity.name === 'Talk to Kapitan'){
        return actor.name + ' meets with ' + actor.activity.district.kapitan.name;
      }else if(actor.activity.name === 'Sortie'){
        return actor.name + ' holds campaign sortie in ' + actor.activity.district.name;
      }else if(actor.activity.name === 'Bribe'){
        if(isHidden){
          return actor.name + ' raises ' + (isOwnCandidate? 'his' : myCandidateName+'\'s') +
             ' Reputation in ' + actor.activity.district.name;
        }else{
          return actor.name + ' bribed voters in ' + actor.activity.district.name;
        }
      }else if(actor.activity.name === 'Smear'){
        if(isHidden){
          return actor.name + ' causes ' + myOpponentName + '\'s reputation to drop in ' + actor.activity.district.name;
        }else{
          return actor.name + ' conducts smear campaign against ' + myOpponentName + ' in ' + actor.activity.district.name;
        }
      }else if(actor.activity.name === 'Educate'){
        return actor.name + ' educates ' + actor.activity.district.name + ' on ' +
          myCandidateName + '\'s ' + that.issues[actor.activity.details.selectedIssue].name + ' Platform';
      }else if(actor.activity.name === 'Contest'){
        return actor.name + ' contests ' + actor.activity.district.name + ' on ' +
          myOpponentName + '\'s ' + that.issues[actor.activity.details.selectedIssue].name + ' Platform';
      }else if(actor.activity.name === 'Move'){
        return actor.name + ' travels to ' + actor.activity.district.name;
      }
    };
  });
