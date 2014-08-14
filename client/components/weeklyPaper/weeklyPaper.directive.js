'use strict';

angular.module('partyanimalsDraftApp')
  .directive('weeklyPaper', function ($compile) {
    return {
      templateUrl: 'components/weeklyPaper/weeklyPaper.html',
      restrict: 'E',
      scope: {
        totalReputations: '=',
        issue: '@',
        ai: '=',
        human: '='
      },
      transclude: true,
      link: function (scope) {
        var electionTips = [
          'In this day and age, the Kapitans hold sway over their districts. <b>Win their favor</b> and their district will be more than willing to hear you out.',
          'Bulwarks contribute $$$ to your campaign funds. Protect your lead over this district to keep your machinery going.',
          'Bulwarks contribute $$$ to your campaign funds. Protect your lead over this district to keep your machinery going.',
          'Bulwarks contribute $$$ to your campaign funds. Protect your lead over this district to keep your machinery going.',
          'Bulwarks contribute $$$ to your campaign funds. Protect your lead over this district to keep your machinery going.',
        ];
        function createNewsItem(type){

          var news = {type: type};
          switch(type){
            case 'POLL':
              //get winner
              var currRep = scope.totalReputations[scope.totalReputations.length-1];
              var winner = scope.human;
              var loser = scope.ai;
              var lead = currRep.ai.reputation - currRep.human.reputation;
              if(lead > 0){
                winner = scope.ai;
                loser = scope.human;
              }
              news.winner= winner;
              news.loser = loser;
              news.pts = Math.abs(lead);
              news.p1 = 'Outstanding placeholder script should be added here';
              news.p2 = 'Well not as outstanding as this one really';
              break;
            case 'OPINION':
              news.headline = 'How to Win an Election #'+scope.issue;
              news.p1 = electionTips[scope.issue-1];
              break;
          }

          return news;
        }
        scope.$watch('issue', function(){
          if(scope.issue > 0){
            scope.newsItems = [];
            var size = [8,4,4,4,4];
            var newsTypes = ['POLL', 'OPINION', 'POLL', 'OPINION', 'POLL'];
            for(var i = 0; i < 5; i++){
              var item = createNewsItem(newsTypes[i]);
              item.columns = size[i];
              scope.newsItems.push(item);
            }
          }
        });
      }
    };
  });
