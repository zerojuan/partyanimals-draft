'use strict';

angular.module('partyanimalsDraftApp')
  .directive('endPaper', function () {
    return {
      templateUrl: 'components/endPaper/endPaper.html',
      restrict: 'E',
      scope: {
        human: '=',
        ai: '=',
        humanVote: '=',
        aiVote: '=',
        districts: '=',
        kapitans: '=',
        cash: '=',
        done: '='
      },
      transclude: true,
      link: function (scope) {
        function createNewsItem(type){
          var data = {};
          data.type = type;
          var didWin = scope.humanVote > scope.aiVote;
          switch(type){
            case 'RESULT':
              console.log('Human Vote: ', scope.humanVote);
              var winner = scope.human;
              var loser = scope.ai;
              data.img = 'win.jpg';
              if(scope.humanVote < scope.aiVote){
                winner = scope.ai;
                loser = scope.human;
                data.img = 'lose.jpg';
              }
              data.winner = winner;
              data.loser = loser;
              data.voteMargin = Math.abs(scope.humanVote - scope.aiVote);
              if(data.voteMargin > 100){
                data.intro = 'After a race that no one ever doubted, ';
                data.intro2 = ' a landslide';
              }else{
                data.intro = 'Coming out in a hard fought election many pundits agree to have been undoubtedly won by sheer grit, ';
                data.intro2 = 'a narrow margin';
              }
              if(data.winner === scope.ai){
                data.follow = '"The voice of the people is the voice of Thigh Bone. Thigh Bone wants me to serve for another term."';
                data.follow2 = ', explains Catorcio as he prepares for his next election.';
              }else{
                data.follow = '"We shall enact Change. Change we can believe in."';
                data.follow2 = ', said Mousey in a speech he delivered to his supporters.';
              }
              break;
            case 'KAPITAN':
              if(!didWin){
                data.didWin = 'There\'s always next year';
              }else{
                data.didWin = 'Congrats!';
              }
              var kaps = _.sortBy(scope.kapitans, function(val){
                return -val.humanRelations;
              });
              data.sample = kaps[0];
              data.kap2 = [kaps[1], kaps[2]];
              break;
            case 'LOSER':

              break;
            case 'MONEY.END':
              if(scope.human.totalCash < 0){
                data.headline = 'Mousey Camp In The Red';
                data.p1 = 'Allegations of unpaid debt from creditors plague Mousey\'s HQ. Pilatopus, Mousey\'s Campaign Manager, deny all allegations of overspending.';
                data.p2 = 'Earlier this week, Mousey\'s parent\'s car was spotted near the local loan Shark.';

                if(didWin){
                  data.comment = '"Well, we all know how he will get that money back."';
                }else{
                  data.comment = '"That\'s what you get when you go up against me. Nice try though."';
                }
              }else{
                data.p2 = 'Earlier this week, Mousey sponsored a beach party at Resort.';
                if(didWin){
                  data.headline = 'Financial Success In Mousey Camp';
                  data.comment = '"They cheated!"';
                  data.p1 = 'The Mousey Camp has recieved special commendation from the National Party. Citing their efficient handling of campaign funds, Mousey is set for a trip to the National Capital to recieve the award.';
                }else{
                  data.headline = 'Mousey Camp Underspent Campaign Funds';
                  data.p1 = 'The Mousey Camp has recieved reprimand from the National Party for allegedly underspending their campaign budget.';
                  data.comment = '"Good for them. They still lost though, so that\'s that."';
                }

              }
              break;
            case 'BRIBERY':
              data.instance = scope.human.bribe;
              data.headline = 'Crocopio Cries Election Fraud';
              if(scope.human.bribe > 2){
                if(didWin){
                  data.instance = scope.human.bribe;
                  data.p1 = 'Crocopio is determined to take his claim to the higher courts, making Mousey\'s initial term a potentially bumpy one.';
                  data.comment = '"Preposterous, that is like a kettle calling another kettle black"';
                }else{
                  data.instance = scope.human.bribe;
                  data.p1 = 'Crocopio is adamant that this kind of dirty politics don\'t happen again.';
                  data.comment = '"Preposterous, if we did what he says we did we then we would have won."';
                }
              }else{
                if(didWin){
                  data.instance = 10;
                  data.p1 = 'Crocopio is adamant that this kind of dirty politics don\'t happen again.';
                  data.comment = '"Nonsense. That photo is an absolute fabrication"';
                }else{
                  data.instance = 10;
                  data.p1 = 'Crocopio is adamant that this kind of dirty politics don\'t happen again.';
                  data.comment = '"Preposterous, if we did what he says we did we then we would have won."';
                }
              }

              break;
            case 'MORALITY':
              if(scope.human.morality > 75){
                data.headline = 'Mousey, Cleanest Politico In History';
                data.feelings = 'great expectations';
              }else if(scope.human.morality > 45){
                data.headline = 'Mousey, Politics as Usual';
                data.feelings = 'no strong feelings';
              }else{
                data.headline = 'Mousey Is Dirty';
                data.feelings = 'great reservations';
              }
              break;

          }
          return data;
        }

        scope.$watch('done', function(){
          if(scope.done){
            scope.newsItems = [];
            var size = [12,4,8,4,4,4];
            var newsTypes = ['RESULT', 'KAPITAN', 'MONEY.END', 'BRIBERY', 'MORALITY'];
            for(var i = 0; i < newsTypes.length; i++){
              var item = createNewsItem(newsTypes[i]);
              item.columns = size[i];
              scope.newsItems.push(item);
            }
          }

        });
      }
    };
  });
