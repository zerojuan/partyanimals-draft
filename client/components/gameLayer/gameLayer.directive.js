'use strict';

angular.module('partyanimalsDraftApp')
  .directive('gameLayer', function (Utils, GameState) {
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
          game.load.image('mousey', './assets/images/avatars/mouseyMale.jpg');
          game.load.image('croc', './assets/images/avatars/crocopio.jpg');
        }

        function create() {

          var centerX = game.world.width / 2;

          districtGroup = game.add.group();
          chipsGroup = game.add.group();

          _.forEach(districtsImages, function(val,i){
            var district = new Phaser.Group(game, districtGroup, val);
            var x = Math.floor(i%2);
            var y = Math.floor(i/2);
            var sprite = new Phaser.Sprite(game, 0, 0, val);
            sprite.inputEnabled = true;
            sprite.anchor.set(0.5);
            sprite.events.onInputDown.add(onDistrictClicked, this);
            district.x = x*120 + centerX - 60;
            district.y = y*120 + 120;
            district.add(sprite);
            districtGroup.add(district);
          });

          var mouseySprite = new Phaser.Sprite(game, 0, 0, 'mousey');
          mouseySprite.anchor.set(0.5);
          mouseySprite.scale.x = mouseySprite.scale.y = .5;
          var crocSprite = new Phaser.Sprite(game, 0, 0, 'croc');
          crocSprite.anchor.set(0.5);
          crocSprite.scale.x = crocSprite.scale.y = .5;
          chipsGroup.add(crocSprite);
          chipsGroup.add(mouseySprite);

        }

        function onDistrictClicked(sprite){
          var index = _.findIndex(districtsImages, function(val){
            return val === sprite.key;
          });
          scope.selectDistrict(index);
        }

        function update() {
        }

        function _findDistrict(name){
          districtGroup.forEach(function(district){
            console.log(district.name, name);
            if(district.name === name){
              district.alpha = 0.5;

              game.add.tween(chipsGroup.getAt(1)).to( { x: district.x, y: district.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
            }else{
              district.alpha = 1;
            }
          });
        }

        function _updateDistrictDetails(){
          _.forEach(GameState.districts, function(district){
            
          });
        }


        var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaserGame', { preload: preload, create: create, update: update }, null, true);

        scope.$watch('selectedDistrict', function(){
          if(scope.selectedDistrict){
            _updateDistrictDetails();
            _findDistrict(Utils.combineDistrictName(scope.selectedDistrict.name));
          }
        });


      }
    };
  });
