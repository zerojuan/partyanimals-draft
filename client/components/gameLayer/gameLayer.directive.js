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
      link: function (scope) {
        var districtGroup;
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
          game.load.atlas('staffers', './assets/images/staff/staff.png', './assets/images/staff/staff.json');
          game.load.image('cursor', './assets/images/ui/cursor.png');
          game.load.image('mousey', './assets/images/avatars/mouseyMale.jpg');
          game.load.image('croc', './assets/images/avatars/crocopio.jpg');
          game.load.image('bg', './assets/images/districts/normal2.png');
          game.load.image('border', './assets/images/ui/border.png');
        }

        function create() {
          var centerX = game.world.width / 2;

          game.add.tileSprite(0,0,1280, 720, 'bg');

          districtGroup = game.add.group();
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
          mouseySprite.scale.x = mouseySprite.scale.y = 0.5;
          var crocSprite = new Phaser.Sprite(game, 0, 0, 'croc');
          crocSprite.anchor.set(0.5);
          crocSprite.scale.x = crocSprite.scale.y = 0.5;
          chipsGroup.add(crocSprite);
          chipsGroup.add(mouseySprite);
          chipsGroup.add(borderSprite);

          $rootScope.$broadcast('CANVAS:ready');
        }

        function onDistrictClicked(sprite){

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
            staffSprite.scale.x = staffSprite.scale.y = 0.5;
            staffSprite.frameName = staff.image;
            staffersGroup.add(staffSprite);
          });
        }

        function _updateStaff(staffFromScope, resolve){
          var from = _findDistrict(Utils.combineDistrictName(scope.human.currentLocation.name));
          var to;
          var localUpdateStaff = function(staff){
            console.log('Updating staff...', staff);
            staff.alpha = 1;
            staff.x = from.base.x;
            staff.y = from.base.y;
            var direction = {x:to.base.x, y:to.base.y};
            if(!resolve){
              console.log('Top Positions: ', to.topPositions, 'Position: ', staffFromScope.position);
              direction = {x:to.topPositions[staffFromScope.position].x+to.base.x, y: to.base.y+to.topPositions[staffFromScope.position].y};
            }
            var tween = game.add.tween(staff).to({x: direction.x, y: direction.y}, 750, Phaser.Easing.Sinusoidal.Out, true);
            if(resolve){
              tween.onComplete.add(function(){
                console.log('Staff to alpha');
                staff.alpha = 0;
              });
            }
          };
          if(staffFromScope){
            var staffToUpdate = _findStaffer(staffFromScope.id);
            if(resolve){
              from = _findDistrict(Utils.combineDistrictName(staffFromScope.districtName));
              to = _findDistrict(Utils.combineDistrictName(scope.human.currentLocation.name));
            }else{
              to = _findDistrict(Utils.combineDistrictName(staffFromScope.districtName));
            }
            console.log('Is resolve?', resolve);
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
          game.add.tween(humanChip).to({x:to.base.x, y:to.base.y}, 500, Phaser.Easing.Sinusoidal.Out, true);

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
                game.add.tween(chipsGroup.getAt(1)).to( { x: district.base.x, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
              }
              if(d.hasAI){
                game.add.tween(chipsGroup.getAt(0)).to( { x: district.base.x, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
              }

              district.updateData();
            });
          }

        }

        var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaserGame', { preload: preload, create: create, update: update }, null, true);

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

        scope.$on('GAME:assign', function(event, staff){
          _updateStaff(staff, false);
        });

        scope.$on('GAME:assign_candidate', function(event, staff){

        });

        scope.$on('GAME:resolve', function(){
          // _updateStaff(staff);
        });

        scope.$on('GAME:ACTION:result', function(evt, actor){
          console.log('Actor Resolving: ', actor);
          _updateStaff(actor, true);
          _updateDistrictDetails(actor.activity.district);
        });

        scope.$on('GAME:ACTION:candidate_result', function(evt, actor){
          console.log('Candidate Resolving:', actor);
          _updateCandidate(actor);
        });

      }
    };
  });
