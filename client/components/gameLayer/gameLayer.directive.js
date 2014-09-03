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
        }

        function create() {
          var centerX = game.world.width / 2;

          game.add.tileSprite(0,0,1280, 720, 'bg');

          districtGroup = game.add.group();
          chipsGroup = game.add.group();
          peoplesGroup = game.add.group();
          staffersGroup = game.add.group();

          _.forEach(districtsImages, function(val,i){
            var district = new GameModel.District(game, districtGroup, peoplesGroup, val, onDistrictClicked, this);
            var x = Math.floor(i%2);
            var y = Math.floor(i/2);
            district.base.x = x*120 + centerX - 60;
            district.base.y = y*120 + 120;
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

        function _updateStaff(){
          _.forEach(scope.staffers, function(staff){
            var staffer = _findStaffer(staff.id);
            if(staff.activity){
              var district = _findDistrict(Utils.combineDistrictName(staff.activity.district.name));
              staffer.alpha = 1;
              staffer.x = district.base.x;
              staffer.y = district.base.y;
            }else{
              staffer.alpha = 0;
            }
          });
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

        scope.$on('GAME:assign', function(){
          _updateStaff();
        });

        scope.$on('GAME:resolve', function(){
          _updateStaff();
        });

        scope.$on('GAME:ACTION:result', function(evt, actor){
          console.log('Actor Resolving: ', actor);
          _updateDistrictDetails(actor.activity.district);
        });

      }
    };
  });
