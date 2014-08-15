'use strict';

angular.module('partyanimalsDraftApp')
  .directive('votingSimulator', function ($interval, $filter) {
    return {
      templateUrl: 'components/votingSimulator/votingSimulator.html',
      restrict: 'E',
      scope: {
        humanVote: '=',
        aiVote: '=',
        districts: '=',
        kapitans: '=',
        cash: '=',
        simMessages: '=',
        done: '='
      },
      link: function (scope) {
        var stopTime,
            districtsCounted = 0,
            actions = 0;
        scope.electionDone = false;
        function updateElection(){
          actions++;
          var currDistrict = scope.districts[districtsCounted];
          if(!currDistrict.extraVals){
            currDistrict.extraVals = {ai: 0, human:0};
          }
          var mod = actions % 3;
          if(mod){
            if(mod === 1){
              //AI Turn
              var aiVals = doAIWork(currDistrict);
              if(aiVals.human !== 0){
                scope.simMessages.unshift({
                  type: 'STATUS',
                  message: 'AI convinced ' +Math.abs(aiVals.human)+' of our supporters to stay in there homes.'
                });
              }else{
                scope.simMessages.unshift({
                  type: 'STATUS',
                  message: 'AI managed to convince ' +Math.abs(aiVals.ai)+' more voters.'
                });
              }
              currDistrict.extraVals.ai += aiVals.ai;
              currDistrict.extraVals.human += aiVals.human;
            }else{
              var humanVals = doHumanWork(currDistrict);
              if(currDistrict.manipulate === 0){
                scope.simMessages.unshift({
                  type: 'STATUS',
                  message: 'Our hard working volunteers managed to convince ' + humanVals.human + ' undecided voters'
                });
              }else if(currDistrict.manipulate === 1){
                var kMod = $filter('feelingstomodifier')(currDistrict.kapitan.humanRelations);
                if(kMod === 0){
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: 'We were able to convince ' + humanVals.human + ' undecided voters'
                  });
                }else if(kMod < 0){
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: 'Despite ' + currDistrict.kapitan.name + ' being uncooperative ' + humanVals.human + ' undecided voters pledged their vote to us.'
                  });
                }else{
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: 'Thanks to ' + currDistrict.kapitan.name + ' we were able to convince ' + humanVals.human + ' undecided voters to vote for us.'
                  });
                }
              }else{
                if(humanVals.ai === 0){
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: 'Our suppression operations failed. We did not hear back from ' + currDistrict.kapitan.name
                  });
                }else if(humanVals.ai > 0){
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: 'Treachery. ' + currDistrict.kapitan.name + ' used our suppression money to convince ' + humanVals.ai + ' undecided voters to the enemy\'s side'
                  });
                }else{
                  scope.simMessages.unshift({
                    type: 'STATUS',
                    message: currDistrict.kapitan.name + ' convinced ' + humanVals.ai + ' enemy supporters to stay in their homes.'
                  });
                }
              }
              currDistrict.extraVals.ai += humanVals.ai;
              currDistrict.extraVals.human += humanVals.human;
            }
          }else{
            var voteCount = getOfficialVoteCount(currDistrict);
            scope.simMessages.unshift({
              type: 'OFFICIAL',
              message: 'Official Result: ' + currDistrict.name,
              vote: voteCount
            });
            calculateVotes(voteCount, currDistrict);
            districtsCounted++;
          }

          if(districtsCounted === 6){
            //congratulations! check who won
            if(scope.humanVote > scope.aiVote){
              scope.simMessages.unshift({
                type: 'WIN',
                message: 'Congratulations! You are now Mayor.'
              });
            }else{
              scope.simMessages.unshift({
                type: 'LOSE',
                message: 'You lost. Better luck next time'
              });
            }
            scope.done = true;
            $interval.cancel(stopTime);
          }
        }

        function getOfficialVoteCount(district){
          var ret = {
            human: 0,
            ai: 0,
            humanProjected: district.humanProjectedVote,
            aiProjected: district.aiProjectedVote,
            district: district
          };
          var portion = district.population * 0.75;
          ret.human = portion * (district.humanReputation / 100);

          ret.human += Math.floor(district.extraVals.human);
          ret.ai = portion * (district.aiReputation / 100);

          ret.ai += Math.floor(district.extraVals.ai);
          if(ret.ai <= 0){
            ret.ai = district.aiProjectedVote;
          }
          if(ret.human <= 0){
            ret.human = district.humanProjectedVote;
          }
          ret.ai = Math.floor(ret.ai);
          ret.human = Math.floor(ret.human);
          return ret;
        }

        function doHumanWork(district){
          var ret = {
            human: 0,
            ai: 0
          };
          var kMod = $filter('feelingstomodifier')(district.kapitan.humanRelations);
          console.log('Kmod: ', district.kapitan);
          if(district.manipulate === 0){
            ret.human = Math.floor((district.population * 0.25) * (Math.random() * 0.10));
          }else if(district.manipulate === 1){
            ret.human = Math.ceil((district.population * 0.25) * ((Math.random() * 0.20 * kMod)));
            if(ret.human === 0){ret.human = 1;}
          }else if(district.manipulate === -1){
            //subtract ai supporters
            ret.ai = Math.floor(-district.aiProjectedVote * kMod);
          }
          return ret;
        }

        function doAIWork(district){
          var ret = {
            human: 0,
            ai: 0
          };

          if(district.humanProjectedVote > district.aiProjectedVote){
            //suppress voters
            ret.human = Math.floor(-(district.humanProjectedVote) * (((Math.random() * 20) + 5) / 100));
          }else{
            //promote me
            ret.ai = Math.floor((district.population * 0.25) * ((Math.random() * 0.20)));
          }
          return ret;
        }

        function calculateVotes(count, district){
          scope.humanVote += count.human;
          scope.aiVote += count.ai;
          district.humanVote = count.human;
          district.aiVote = count.ai;
        }

        if(!scope.done){
          stopTime = $interval(updateElection, 2000);
          scope.simMessages = [];
        }else{
          scope.electionDone = true;
        }


      }
    };
  });
