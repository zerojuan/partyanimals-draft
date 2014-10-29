'use strict';

angular.module('partyanimalsDraftApp')
  .service('NewspaperService', function Newspaperservice() {

    var that = this;
    this.setupCandidates = function(human, ai, issues){
      that.human = human;
      that.ai = ai;
      that.issues = issues;
    };

    var randomBigNews = [
      {
        headline: 'Slow News Day, So What Now?',
        story: 'We can\'t just let our writers sit here playing Candy Crush. So we wrote this filler story about it.'
      },
      {
        headline: 'Nothing Politically Important Happened. OMG',
        story: 'OMG. Like totally. Blew our minds too. Our stockholders are not going to believe this.'
      }
    ];

    var randomSmallNews = [
      {
        headline: 'Babies Are Born',
        story: 'Another batch of babies were born today. Happy Birthday babies. '
      },
      {
        headline: 'Is It Going To Rain Tomorrow?',
        story: 'It might. Scientists admit that they are not God and cannot really be sure.'
      },
      {
        headline: 'Obituaries: Who Likes Reading Them?',
        story: 'People who like obituaries have 60% chance of finding old dead relatives.'
      },
      {
        headline: 'Solon Claims To Own Summer Island?',
        story: 'Not really. We are making this up because it\'s a slow news day'
      },
      {
        headline: 'Have We Recycled This Headline Yet?',
        story: 'If you haven\'t read this before then good for you!'
      }
    ];

    this.createFillerHeadline = function(){
      return randomBigNews[Math.floor(Math.random()*randomBigNews.length)];
    };

    this.createFillerStory = function(){
      return randomSmallNews[Math.floor(Math.random()*randomSmallNews.length)];
    };

    this.createStory = function(actor, isHidden){
      var isOwnCandidate;
      var myCandidateName;
      var myOpponentName;

      if(actor.team === 'HUMAN'){
        isOwnCandidate = actor.name === that.human.name;
        myCandidateName = that.human.name;
        myOpponentName = that.ai.name;
      }else if(actor.team === 'AI'){
        isOwnCandidate = actor.name === that.ai.name;
        myCandidateName = that.ai.name;
        myOpponentName = that.human.name;
      }

      if(actor.activity.name === 'Talk to Kapitan'){
        return actor.name + ' visited ' + actor.activity.district.kapitan.name + '\'s residence today.' +
          ' The discussion had nothing to do with the elections. They were just being friendly and normal animals.';
      }else if(actor.activity.name === 'Sortie') {
        return actor.activity.district.name + '- Mayoralty candidate ' + actor.name + ' held a spectacular campaign sortie.' +
          'Everyone loved them some campaign swag and the speeches were ok too.';
      }else if(actor.activity.name === 'Bribe'){
        if(isHidden){
          return '"We merely reached out to the voters in a manner we know they\'ll understand." - ' + actor.name + '.';
        }else{
          return '"It\'s bribery, plain and simple." - '+ myOpponentName + '.';
        }
      }else if(actor.activity.name === 'Smear'){
        if(isHidden){
          return '"The people have seen through the kind of crooked man ' + myOpponentName + ' really is.", ' + actor.name + '.';
        }else{
          return '"This kind of political mudslinging should be condemned!" - ' + myOpponentName;
        }
      }else if(actor.activity.name === 'Educate'){
        return '"The people of '+actor.activity.district.name+' should know that the '+that.issues[actor.activity.details.selectedIssue].name+' problem is something ' +
          myCandidateName + ' is very serious on solving." - ' + actor.name;
      }else if(actor.activity.name === 'Contest'){
        return '"'+myOpponentName+' doesn\'t care about ' + that.issues[actor.activity.details.selectedIssue].name + ', I\'m glad the people of '+
          actor.activity.district.name + ' have seen that." - ' + actor.name;
      }else if(actor.activity.name === 'Move'){
        return '"We have great things planned for this District!" - ' + actor.name;
      }
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
