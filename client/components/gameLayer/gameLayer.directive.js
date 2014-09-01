'use strict';

angular.module('partyanimalsDraftApp')
  .directive('gameLayer', function (Utils, GameState, GameModel) {
    return {
      template: '<div id="phaserGame"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        selectDistrict: '=',
        selectedDistrict: '='
      },
      link: function (scope) {
        var districtGroup;
        var chipsGroup;
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

          _.forEach(districtsImages, function(val,i){
            var district = new GameModel.District(game, districtGroup, val, onDistrictClicked, this);
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
          // cursor.x = game.input.mousePointer.x;
          // cursor.y = game.input.mousePointer.y;
        }

        function _findDistrict(name){
          return _.find(districtArray, function(district){
            return district.name === name;
          });
        }

        function _updateDistrictDetails(){
          _.forEach(GameState.districts, function(d){
            //find equivalent
            var district = _findDistrict(Utils.combineDistrictName(d.name));
            district.label.text = d.name;
            if(d.hasHuman){
              game.add.tween(chipsGroup.getAt(1)).to( { x: district.base.x, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
            }
            if(d.hasAI){
              game.add.tween(chipsGroup.getAt(0)).to( { x: district.base.x, y: district.base.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
            }
          });
        }


        var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaserGame', { preload: preload, create: create, update: update }, null, true);

        scope.$watch('selectedDistrict', function(){
          if(scope.selectedDistrict){
            _updateDistrictDetails();
            // _findDistrict(Utils.combineDistrictName(scope.selectedDistrict.name));
          }
        });

        scope.$on('GAME:turn', function(){
          _updateDistrictDetails();
          // _findDistrict(Utils.combineDistrictName(scope.selectedDistrict.name));
        });

      }
    };
  });
