'use strict';

angular.module('partyanimalsDraftApp')
  .directive('gameLayer', function ($rootScope, Utils, GameState, GameModel) {
    return {
      template: '<div id="phaserGame"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        selectDistrict: '=',
        selectedDistrict: '=',
        human: '=',
        ai: '=',
        staffers: '='
      },
      link: function (scope){
        var seaBG1;
        var seaBG2;
        var districtGroup;
        var uiGroup;
        var chipsGroup;
        var staffersGroup;
        var peoplesGroup;
        // var cursor;
        var districtArray = [];
        var districtsImages = [
          'kapitolyo',
          'casino',
          'fishingvillage',
          'port',
          'cathedral',
          'resort'
        ];
        function preload() {
          game.stage.backgroundColor = '#53b5ef';
          _.forEach(districtsImages, function(val){
            game.load.image(val, './assets/images/districts/'+val+'.jpg');
          });
          game.load.spritesheet('people', './assets/images/ui/tiny-people.png', 15, 20, 4);
          game.load.atlas('staffers', './assets/images/avatars/staff/staff.png', './assets/images/staff/staff.json');
          game.load.image('cursor', './assets/images/ui/cursor.png');
          game.load.image('mousey', './assets/images/staff/mouse.png');
          game.load.image('croc', './assets/images/staff/crocopio.png');
          game.load.image('bg', './assets/images/districts/normal2.png');
          game.load.image('border', './assets/images/ui/border.png');
        }

        function create() {
          var centerX = game.world.width / 2;

          seaBG1 = game.add.tileSprite(0,0,w, h, 'bg');
          seaBG2 = game.add.tileSprite(w,0,w,h, 'bg');

          districtGroup = game.add.group();
          uiGroup = game.add.group();
          staffersGroup = game.add.group();
          chipsGroup = game.add.group();
          peoplesGroup = game.add.group();

          var borderSprite = new Phaser.Sprite(game, 0, 0, 'border');
          borderSprite.anchor.set(0.5);
          borderSprite.alpha = 0;
          borderSprite.x = -100;
          borderSprite.y = -100;
          borderSprite.tint = 0x0000ff;
          game.add.tween(borderSprite).to( {alpha: 0.5}, 500, Phaser.Easing.Linear.Out, true).to({alpha: 1}, 500, Phaser.Easing.Linear.Out, true).loop();
          uiGroup.add(borderSprite);

          _.forEach(districtsImages, function(val,i){
            var district = new GameModel.District(game, districtGroup, peoplesGroup, val, onDistrictClicked, this);
            var x = Math.floor(i%2);
            var y = Math.floor(i/2);
            district.base.x = x*120 + centerX - 60;
            district.base.y = y*120 + 120;
            district.border = borderSprite;
            districtGroup.add(district.base);
            districtArray.push(district);
          });

          // cursor = game.add.sprite(0,0, 'cursor');
          var mouseySprite = new Phaser.Sprite(game, 0, 0, 'mousey');
          mouseySprite.anchor.set(0.5);
          mouseySprite.scale.x = mouseySprite.scale.y = 0.75;
          var crocSprite = new Phaser.Sprite(game, 0, 0, 'croc');
          crocSprite.anchor.set(0.5);
          crocSprite.scale.x = crocSprite.scale.y = 0.75;
          chipsGroup.add(crocSprite);
          chipsGroup.add(mouseySprite);

          $rootScope.$broadcast('CANVAS:ready');
        }

        function onDistrictClicked(sprite){
          console.log('District clicked: ', sprite);
          var index = _.findIndex(districtsImages, function(val){
            return val === sprite.key;
          });

          _.forEach(districtArray, function(val, i){
            if(i === index){
              val.selected();
            }else{
              val.unSelected();
            }
          });
          scope.selectDistrict(index);
        }

        function update() {
          _.forEach(districtArray, function(val){
            val.update();
          });
        }

        function _findDistrict(name){
          return _.find(districtArray, function(district){
            return district.name === name;
          });
        }

        function _findStaffer(name){
          var sprite;
          staffersGroup.forEach(function(staffSprite){
            if(staffSprite.name === name){
              sprite = staffSprite;
            }
          });
          return sprite;
        }

        function _setupStaff(){
          _.forEach(scope.staffers, function(staff){
            var staffSprite = new Phaser.Sprite(game, 0, 0, 'staffers');
            staffSprite.name = staff.id;
            staffSprite.anchor.set(0.5);
            staffSprite.scale.x = staffSprite.scale.y = 0.75;
            console.log('Setting up sprite: ', staff.image);
            staffSprite.frameName = staff.image;
            staffersGroup.add(staffSprite);
          });
        }

        function _updateGameTurn(){
          console.log('Game has turned');
          var currentBG = (seaBG1.x === 0) ? seaBG1 : seaBG2;
          var otherBG = (seaBG1.x === 0) ? seaBG2 : seaBG1;
          otherBG.x = w;
          game.add.tween(currentBG).to({x:-w}, 750, Phaser.Easing.Sinusoidal.Out, true);
          game.add.tween(otherBG).to({x:0}, 750, Phaser.Easing.Sinusoidal.Out, true);
        }

        function _updateStaff(staffFromScope, resolve, isHuman){
          var player = scope.human;
          if(!isHuman){
            player = scope.ai;
          }
          var from = _findDistrict(Utils.combineDistrictName(player.currentLocation.name));
          var to;

          var localUpdateStaff = function(staff){
            staff.alpha = 1;
            var direction = {x:to.base.x, y:to.base.y};
            if(!resolve){
              staff.x = from.base.x;
              staff.y = from.base.y;
              var positions = isHuman ? to.topPositions : to.bottomPositions;
              direction = {x:positions[staffFromScope.position].x+to.base.x, y: to.base.y+positions[staffFromScope.position].y};
            }
            var tween = game.add.tween(staff).to({x: direction.x, y: direction.y}, 750, Phaser.Easing.Sinusoidal.Out, true);
            if(resolve){
              tween.onComplete.add(function(){
                staff.alpha = 0;
              });
            }
          };

          if(staffFromScope){
            var staffToUpdate = _findStaffer(staffFromScope.id);
            if(resolve){
              from = _findDistrict(Utils.combineDistrictName(staffFromScope.districtName));
              to = _findDistrict(Utils.combineDistrictName(player.currentLocation.name));
            }else{
              to = _findDistrict(Utils.combineDistrictName(staffFromScope.districtName));
            }
            localUpdateStaff(staffToUpdate);
          }else{
            _.forEach(scope.staffers, function(staff){
              var staffer = _findStaffer(staff.id);
              if(staff.activity){
                to = _findDistrict(Utils.combineDistrictName(staff.activity.district.name));
                localUpdateStaff(staffer);
              }else{
                staffer.alpha = 0;
              }
            });
          }
        }

        function _updateCandidate(candidate){
          var from = _findDistrict(Utils.combineDistrictName(scope.human.currentLocation.name));
          var to = _findDistrict(Utils.combineDistrictName(candidate.districtName));
          var humanChip = chipsGroup.getAt(1);
          humanChip.x = from.base.x;
          humanChip.y = from.base.y;
          game.add.tween(humanChip).to({x:to.base.x-15, y:to.base.y}, 500, Phaser.Easing.Sinusoidal.Out, true);

        }

        function _updateAICandidate(candidate){
          var from = _findDistrict(Utils.combineDistrictName(scope.ai.currentLocation.name));
          var to = _findDistrict(Utils.combineDistrictName(candidate.districtName));
          var aiChip = chipsGroup.getAt(0);
          aiChip.x = from.base.x;
          aiChip.y = from.base.y;
          game.add.tween(aiChip).to({x:to.base.x+15, y:to.base.y}, 500, Phaser.Easing.Sinusoidal.Out, true);
        }

        function _updateDistrictDetails(districtToUpdate){
          var district;
          if(districtToUpdate){
            district = _findDistrict(Utils.combineDistrictName(districtToUpdate.name));
            district.updateData();
          }else{
            console.log('Rendering district details...', GameState.districts.length);
            _.forEach(GameState.districts, function(d){
              //find equivalent
              district = _findDistrict(Utils.combineDistrictName(d.name));
              district.label.text = d.name;
              district.data = d;

              if(d.hasHuman){
                game.add.tween(chipsGroup.getAt(1)).to( { x: district.base.x-15, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
              }
              if(d.hasAI){
                game.add.tween(chipsGroup.getAt(0)).to( { x: district.base.x+15, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
              }

              district.updateData();
            });
          }

        }

        var w = window.innerWidth, //* window.devicePixelRatio,
            h = window.innerHeight;// * window.devicePixelRatio;
        var game = new Phaser.Game(w, h, Phaser.AUTO, 'phaserGame', { preload: preload, create: create, update: update }, null, true);
        game.scaleMode = Phaser.ScaleManager.RESIZE;
        // game.setScreenSize(true);
        scope.$watch('selectedDistrict', function(){
          if(scope.selectedDistrict){
            //_updateDistrictDetails();
            // _findDistrict(Utils.combineDistrictName(scope.selectedDistrict.name));
          }
        });

        scope.$on('GAME:start', function(){
          console.log('Starting the game...');
          _updateDistrictDetails();
          _setupStaff();
        });

        scope.$on('GAME:turn', function(){
          console.log('Game turned');
          _updateGameTurn();
        });

        scope.$on('GAME:assign', function(event, staff){
          _updateStaff(staff, false, true);
        });

        scope.$on('GAME:assign_ai', function(event, staff){
          console.log('AI Assignment: ', staff);
          _updateStaff(staff, false, false);
        });

        scope.$on('GAME:assign_candidate', function(event, staff){

        });

        scope.$on('GAME:assign_candidate_ai', function(event, staff){

        });

        scope.$on('GAME:resolve', function(){
          // _updateStaff(staff);
        });

        scope.$on('GAME:cancel', function(event, staff){
          _updateStaff(staff, true, true);
        });

        scope.$on('GAME:ACTION:result', function(evt, actor){
          console.log('Actor Resolving: ', actor);
          _updateStaff(actor, true, true);
          _updateDistrictDetails(actor.activity.district);
        });

        scope.$on('GAME:ACTION:result_ai', function(evt, actor){
          _updateStaff(actor, true, false);
          _updateDistrictDetails(actor.activity.district);
        });

        scope.$on('GAME:ACTION:candidate_result', function(evt, actor){
          console.log('Candidate Resolving:', actor);
          _updateCandidate(actor);
        });

        scope.$on('GAME:ACTION:candidate_result_ai', function(evt, actor){
          console.log('AI Candidate Resolving:', actor);
          _updateAICandidate(actor);
        });

      }
    };
  });
